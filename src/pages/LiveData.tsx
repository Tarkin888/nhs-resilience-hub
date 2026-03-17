import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { Radio, Database, RefreshCw, CheckCircle, AlertTriangle, XCircle, Info, ExternalLink, ArrowUpDown, TrendingUp, TrendingDown, Minus, AlertCircle, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ReferenceLine, ResponsiveContainer, Cell, LabelList,
  AreaChart, Area,
} from 'recharts';
import Header from '@/components/Header';
import StatusFooter from '@/components/StatusFooter';
import PredictiveRiskCard from '@/components/live-data/PredictiveRiskCard';
import { supabase } from '@/integrations/supabase/client';
import { useAuditTrail } from '@/contexts/AuditTrailContext';
import DataProvenanceTooltip from '@/components/live-data/DataProvenanceTooltip';

const PROVIDERS = [
  { code: 'R0A', name: 'Manchester University NHS FT' },
  { code: 'RRK', name: 'University Hospitals Birmingham NHS FT' },
  { code: 'RJZ', name: "King's College Hospital NHS FT" },
  { code: 'RR8', name: 'Leeds Teaching Hospitals NHS Trust' },
  { code: 'RJ1', name: "Guy's and St Thomas' NHS FT" },
];

interface TestRow {
  test_code: string;
  test_description: string;
  total_waiting_list: number;
  waiting_6_plus_weeks: number;
  percent_6_plus_weeks: number;
  total_activity: number;
}

interface DM01Summary {
  total_waiting_list: number;
  total_waiting_6_plus_weeks: number;
  percent_6_plus_weeks: number;
  total_activity: number;
  status: string;
}

interface DM01Response {
  provider_code: string;
  provider_name: string;
  period: string;
  summary: DM01Summary;
  tests: TestRow[];
  error?: string;
  meta?: {
    source_url?: string;
    sheet_name?: string;
    [key: string]: unknown;
  };
}

type SortKey = 'test_description' | 'total_waiting_list' | 'waiting_6_plus_weeks' | 'percent_6_plus_weeks' | 'total_activity';

const getBarColor = (pct: number) => pct <= 1 ? '#10B981' : pct <= 5 ? '#F59E0B' : '#EF4444';
const getBadgeClasses = (pct: number) =>
  pct <= 1
    ? 'bg-[#10B981]/10 text-[#059669]'
    : pct <= 5
    ? 'bg-[#F59E0B]/10 text-[#D97706]'
    : 'bg-[#EF4444]/10 text-[#DC2626]';
const fmt = (n: number) => n.toLocaleString('en-GB');
const truncate = (s: string, max: number) => s.length > max ? s.slice(0, max) + '…' : s;

interface TrendPoint {
  period: string;
  percent_6_plus_weeks: number;
  total_waiting_list: number;
  total_waiting_6_plus_weeks: number;
  total_activity: number;
  status: string;
}

const formatPeriodShort = (period: string) => {
  const [y, m] = period.split('-');
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return `${months[parseInt(m, 10) - 1]} ${y.slice(2)}`;
};

const LOADING_MESSAGES = [
  'Connecting to NHS England...',
  'Downloading data...',
  'Processing...',
];

/* ── Freshness helpers ─────────────────────────────────── */
function getFreshnessInfo(lastRefreshed: Date | null) {
  if (!lastRefreshed) return null;
  const hours = (Date.now() - lastRefreshed.getTime()) / 3600000;
  if (hours <= 24) return { color: '#10B981', label: 'Fresh' };
  if (hours <= 168) return { color: '#F59E0B', label: '1-7 days old' };
  return { color: '#EF4444', label: 'Stale (7+ days)' };
}

/* ── Skeleton blocks ───────────────────────────────────── */
const SkeletonBlock = ({ className = '' }: { className?: string }) => (
  <div className={`animate-pulse rounded-lg bg-muted ${className}`} />
);

const StatusTileSkeleton = () => (
  <div className="w-full bg-card rounded-xl border border-border shadow-sm" style={{ borderLeft: '4px solid hsl(var(--border))' }}>
    <div className="flex flex-col lg:flex-row">
      <div className="flex-[3] p-6 lg:p-8 space-y-4">
        <SkeletonBlock className="h-7 w-3/4" />
        <SkeletonBlock className="h-4 w-1/3" />
        <SkeletonBlock className="h-10 w-36 rounded-full" />
      </div>
      <div className="flex-[2] p-6 lg:p-8 space-y-3 lg:border-l border-border">
        <SkeletonBlock className="h-24" />
        <SkeletonBlock className="h-20" />
        <SkeletonBlock className="h-20" />
      </div>
    </div>
  </div>
);

const ChartSkeleton = () => (
  <div className="w-full bg-card rounded-xl border border-border shadow-sm p-6 lg:p-8 space-y-4">
    <SkeletonBlock className="h-6 w-64" />
    <SkeletonBlock className="h-4 w-80" />
    <SkeletonBlock className="h-[300px]" />
  </div>
);

const TableSkeleton = () => (
  <div className="w-full bg-card rounded-xl border border-border shadow-sm p-6 lg:p-8 space-y-3">
    <SkeletonBlock className="h-6 w-56" />
    {Array.from({ length: 6 }).map((_, i) => (
      <SkeletonBlock key={i} className="h-10 w-full" />
    ))}
  </div>
);

export default function LiveData() {
  const [isMethodologyOpen, setIsMethodologyOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState('R0A');
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [data, setData] = useState<DM01Response | null>(null);
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [errorType, setErrorType] = useState<'fetch' | 'provider'>('fetch');
  const [sortKey, setSortKey] = useState<SortKey>('percent_6_plus_weeks');
  const [sortAsc, setSortAsc] = useState(false);
  const [trendData, setTrendData] = useState<TrendPoint[]>([]);
  const [trendLoading, setTrendLoading] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const loadingInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  const prevData = useRef<DM01Response | null>(null);
  const { logEntry } = useAuditTrail();

  // Progressive loading messages
  useEffect(() => {
    if (loading) {
      setLoadingStep(0);
      loadingInterval.current = setInterval(() => {
        setLoadingStep(prev => Math.min(prev + 1, LOADING_MESSAGES.length - 1));
      }, 2000);
    } else {
      if (loadingInterval.current) clearInterval(loadingInterval.current);
    }
    return () => { if (loadingInterval.current) clearInterval(loadingInterval.current); };
  }, [loading]);

  const fetchTrend = useCallback(async (providerCode: string) => {
    setTrendLoading(true);
    try {
      const { data: result, error: fnError } = await supabase.functions.invoke(
        'fetch-dm01-history',
        { body: { providerCode, period: '2026-01' } }
      );
      if (fnError) throw fnError;
      if (result?.trend) setTrendData(result.trend);
    } catch (err) {
      console.error('Failed to fetch trend data:', err);
    } finally {
      setTrendLoading(false);
    }
  }, []);

  const fetchData = async (providerCode?: string) => {
    const code = providerCode ?? selectedProvider;
    const provider = PROVIDERS.find(p => p.code === code);
    const providerLabel = provider ? `${provider.name} (${code})` : code;
    const auditSource = 'NHS England Official Statistics — DM01 Monthly Diagnostics';

    setLoading(true);
    setError(null);
    setErrorType('fetch');

    logEntry({ source: auditSource, metric: `Data fetch initiated — ${providerLabel}`, newValue: 'Fetching', category: 'fetch' });

    try {
      const { data: result, error: fnError } = await supabase.functions.invoke(
        'fetch-dm01-data',
        { body: { providerCode: code, period: '2026-01' } }
      );
      if (fnError) throw fnError;
      if (result?.error) {
        const isProviderError = (result.error as string).toLowerCase().includes('not found') || (result.error as string).toLowerCase().includes('provider');
        setErrorType(isProviderError ? 'provider' : 'fetch');
        setError(result.error);
        setData(null);
        logEntry({ source: auditSource, metric: `Data fetch failed — ${providerLabel}`, newValue: result.error, category: 'fetch' });
      } else {
        const res = result as DM01Response;
        const periodLabel = (() => { const [y, m] = res.period.split('-'); const months = ['January','February','March','April','May','June','July','August','September','October','November','December']; return `${months[parseInt(m, 10) - 1]} ${y}`; })();
        const prev = prevData.current;

        // Log summary metrics with old → new values
        logEntry({ source: auditSource, metric: `Diagnostics Access Performance — DM01 (${providerLabel}, ${periodLabel})`, oldValue: prev ? `${prev.summary.percent_6_plus_weeks.toFixed(1)}%` : undefined, newValue: `${res.summary.percent_6_plus_weeks.toFixed(1)}% waiting 6+ weeks`, category: 'fetch' });
        logEntry({ source: auditSource, metric: 'Total Waiting List', oldValue: prev ? fmt(prev.summary.total_waiting_list) : undefined, newValue: fmt(res.summary.total_waiting_list), category: 'fetch' });
        logEntry({ source: auditSource, metric: 'Patients Waiting 6+ Weeks', oldValue: prev ? fmt(prev.summary.total_waiting_6_plus_weeks) : undefined, newValue: fmt(res.summary.total_waiting_6_plus_weeks), category: 'fetch' });
        logEntry({ source: auditSource, metric: 'Monthly Activity', oldValue: prev ? fmt(prev.summary.total_activity) : undefined, newValue: fmt(res.summary.total_activity), category: 'fetch' });
        logEntry({ source: auditSource, metric: `Trust: ${providerLabel} — Period: ${periodLabel}`, newValue: `${res.tests.length} diagnostic modalities loaded`, category: 'fetch' });

        prevData.current = res;
        setData(res);
        setLastRefreshed(new Date());
        fetchTrend(code);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to fetch data';
      setError(msg);
      setErrorType('fetch');
      setData(null);
      logEntry({ source: auditSource, metric: `Data fetch error — ${providerLabel}`, newValue: msg, category: 'fetch' });
    } finally {
      setLoading(false);
    }
  };

  const handleProviderChange = (code: string) => {
    setSelectedProvider(code);
    fetchData(code);
  };

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortAsc(!sortAsc);
    else { setSortKey(key); setSortAsc(false); }
  };

  const sortedTests = useMemo(() => {
    if (!data) return [];
    return [...data.tests].sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (typeof av === 'string' && typeof bv === 'string') return sortAsc ? av.localeCompare(bv) : bv.localeCompare(av);
      return sortAsc ? (av as number) - (bv as number) : (bv as number) - (av as number);
    });
  }, [data, sortKey, sortAsc]);

  const chartData = useMemo(() => {
    if (!data) return [];
    return [...data.tests]
      .sort((a, b) => b.percent_6_plus_weeks - a.percent_6_plus_weeks)
      .map((t) => ({ name: truncate(t.test_description, 25), fullName: t.test_description, pct: t.percent_6_plus_weeks }));
  }, [data]);

  const currentProvider = PROVIDERS.find((p) => p.code === selectedProvider);
  const freshness = getFreshnessInfo(lastRefreshed);

  const SortHeader = ({ label, field }: { label: string; field: SortKey }) => (
    <th
      className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer hover:text-foreground select-none whitespace-nowrap"
      onClick={() => handleSort(field)}
    >
      <span className="inline-flex items-center gap-1">
        {label}
        <ArrowUpDown className={`h-3 w-3 ${sortKey === field ? 'text-primary' : 'text-muted-foreground/40'}`} />
      </span>
    </th>
  );

  // Print header info
  const printTitle = data
    ? `NHS Diagnostics Performance - ${data.provider_name} - ${(() => { const [y, m] = data.period.split('-'); const months = ['January','February','March','April','May','June','July','August','September','October','November','December']; return `${months[parseInt(m, 10) - 1]} ${y}`; })()}`
    : 'NHS Diagnostics Performance';

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Print-only header */}
      <div className="hidden print:block print:mb-6 print:border-b-2 print:border-foreground print:pb-4">
        <h1 className="text-xl font-bold text-foreground">{printTitle}</h1>
        <p className="text-sm text-muted-foreground mt-1">Generated: {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
      </div>

      <div className="print:hidden">
        <Header isMethodologyOpen={isMethodologyOpen} onMethodologyOpenChange={setIsMethodologyOpen} />
      </div>

      <main className="flex-1 max-w-[1400px] mx-auto w-full px-4 md:px-8 py-6 space-y-6">
        {/* ── Live Data Banner ─────────────────────────────── */}
        <div
          className="w-full rounded-lg px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 print:hidden"
          style={{ backgroundColor: '#E8F5E9', borderLeft: '4px solid #2E7D32' }}
        >
          <div className="flex items-center gap-2">
            <Radio className="h-5 w-5" style={{ color: '#2E7D32' }} />
            <span className="font-semibold text-sm" style={{ color: '#2E7D32' }}>LIVE DATA</span>
            <span className="text-sm hidden sm:inline" style={{ color: '#1B5E20' }}>| Sourced from NHS England Monthly Diagnostics (DM01)</span>
          </div>
          <div className="flex items-center gap-3">
            {lastRefreshed && freshness && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="flex items-center gap-1.5 text-xs" style={{ color: '#2E7D32' }}>
                    <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: freshness.color }} />
                    Last refreshed: {lastRefreshed.toLocaleTimeString()}
                  </span>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="max-w-[220px]">
                  <p className="text-xs font-medium">{freshness.label}</p>
                  <p className="text-xs text-muted-foreground mt-1">NHS England typically publishes new DM01 data monthly, 4-6 weeks after the reporting period.</p>
                </TooltipContent>
              </Tooltip>
            )}
            <Button variant="outline" size="sm" className="gap-1.5 border-[#2E7D32] text-[#2E7D32] hover:bg-[#C8E6C9]" onClick={() => fetchData()} disabled={loading}>
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh Data</span>
            </Button>
          </div>
        </div>

        {/* ── Page Header + Provider Selector ─────────────── */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Diagnostics Access Performance</h2>
            <p className="text-muted-foreground mt-1">Monthly Diagnostic Waiting Times and Activity (DM01)</p>
            <p className="text-xs text-muted-foreground mt-1">Source: NHS England Official Statistics | Operational Standard: &lt;1% waiting 6+ weeks</p>
          </div>
          <div className="print:hidden w-full md:w-auto">
            <Select value={selectedProvider} onValueChange={handleProviderChange}>
              <SelectTrigger className="w-full md:w-[340px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                {PROVIDERS.map((p) => (
                  <SelectItem key={p.code} value={p.code}>{p.name} ({p.code})</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* ── Error State ─────────────────────────────────── */}
        {error && (
          <div className="w-full bg-[#FEF2F2] rounded-xl border border-[#FECACA] shadow-sm" style={{ borderLeft: '4px solid #EF4444' }}>
            <div className="p-6 flex items-start gap-4">
              <AlertCircle className="h-6 w-6 text-[#DC2626] flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="text-base font-semibold text-[#991B1B]">
                  {errorType === 'provider'
                    ? `Provider ${selectedProvider} not found`
                    : 'Unable to fetch NHS England data'}
                </h3>
                <p className="text-sm text-[#7F1D1D] mt-1">
                  {errorType === 'provider'
                    ? `Provider ${selectedProvider} was not found in the latest DM01 data. Please select a different provider.`
                    : 'The DM01 data file could not be retrieved. This may be because NHS England is updating their statistics. Please try again later.'}
                </p>
                {error !== 'Failed to fetch data' && (
                  <p className="text-xs text-[#9B1C1C]/70 mt-2 font-mono">{error}</p>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3 gap-1.5 border-[#EF4444] text-[#DC2626] hover:bg-[#FEE2E2]"
                  onClick={() => fetchData()}
                  disabled={loading}
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
                  Retry
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* ── Loading Skeletons ────────────────────────────── */}
        {loading && (
          <>
            <Card>
              <CardContent className="py-8 text-center">
                <RefreshCw className="h-8 w-8 animate-spin mx-auto text-primary mb-3" />
                <p className="font-medium text-foreground">{LOADING_MESSAGES[loadingStep]}</p>
                <p className="text-xs text-muted-foreground mt-1">This may take a moment while we download and parse the NHS England spreadsheet.</p>
              </CardContent>
            </Card>
            <StatusTileSkeleton />
            <ChartSkeleton />
            <TableSkeleton />
          </>
        )}

        {/* ── Empty State ─────────────────────────────────── */}
        {!data && !loading && !error && (
          <Card>
            <CardContent className="py-16 flex flex-col items-center text-center gap-4">
              <Database className="h-12 w-12 text-muted-foreground/50" />
              <div>
                <p className="font-medium text-foreground">No data loaded</p>
                <p className="text-sm text-muted-foreground mt-1">Click "Fetch Latest Data" to fetch the latest DM01 data from NHS England.</p>
              </div>
              <Button onClick={() => fetchData()} className="gap-2" style={{ backgroundColor: '#005EB8' }}>
                <Database className="h-4 w-4" />
                Fetch Latest Data
              </Button>
            </CardContent>
          </Card>
        )}

        {/* ── Diagnostics Status Tile ─────────────────────── */}
        {data && !loading && (() => {
          const s = data.summary;
          const statusColor = s.status === 'Operational' ? '#00A651' : s.status === 'Degraded' ? '#FFB81C' : '#DA291C';
          const StatusIcon = s.status === 'Operational' ? CheckCircle : s.status === 'Degraded' ? AlertTriangle : XCircle;
          const statusTextColor = s.status === 'Degraded' ? '#212B32' : '#FFFFFF';
          const periodLabel = (() => {
            const [y, m] = data.period.split('-');
            const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
            return `${months[parseInt(m, 10) - 1]} ${y}`;
          })();

          return (
            <div className="w-full bg-card rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow print:shadow-none print:hover:shadow-none" style={{ borderLeft: `4px solid ${statusColor}` }}>
              <div className="flex flex-col lg:flex-row">
                <div className="flex-[3] p-6 lg:p-8 flex flex-col justify-center gap-4">
                  <div>
                    <h3 className="text-2xl font-bold text-foreground">{data.provider_name}</h3>
                    <p className="text-muted-foreground mt-1">{periodLabel}</p>
                  </div>
                  <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-base font-semibold w-fit" style={{ backgroundColor: statusColor, color: statusTextColor }}>
                    <StatusIcon className="h-5 w-5" />
                    {s.status}
                  </div>
                </div>
                <div className="flex-[2] p-6 lg:p-8 flex flex-col gap-3 lg:border-l border-border">
                  <div className="rounded-lg p-4" style={{ backgroundColor: `${statusColor}10`, border: `1px solid ${statusColor}30` }}>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                      Patients Waiting 6+ Weeks
                      <DataProvenanceTooltip tab="Provider" providerName={data.provider_name} providerCode={data.provider_code} period={periodLabel} fieldDescription={`"Number waiting 6+ Weeks" column → ${data.provider_code} total row\nPercentage = Number waiting 6+ Weeks ÷ Total Waiting List × 100`} sourceUrl={data.meta?.source_url} />
                    </p>
                    <p className="text-3xl font-bold mt-1" style={{ color: statusColor }}>{fmt(s.total_waiting_6_plus_weeks)}</p>
                    <p className="text-sm text-muted-foreground mt-0.5">{s.percent_6_plus_weeks.toFixed(1)}% of waiting list</p>
                  </div>
                  <div className="rounded-lg border border-border bg-muted/30 p-4">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                      Total Waiting List
                      <DataProvenanceTooltip tab="Provider" providerName={data.provider_name} providerCode={data.provider_code} period={periodLabel} fieldDescription={`"Total Waiting List" column → ${data.provider_code} total row`} sourceUrl={data.meta?.source_url} />
                    </p>
                    <p className="text-2xl font-bold text-foreground mt-1">{fmt(s.total_waiting_list)}</p>
                    <p className="text-sm text-muted-foreground mt-0.5">patients across {data.tests.length} {data.tests.length === 1 ? 'test' : 'tests'}</p>
                  </div>
                  <div className="rounded-lg border border-border bg-muted/30 p-4">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                      Monthly Activity
                      <DataProvenanceTooltip tab="Provider by Test" providerName={data.provider_name} providerCode={data.provider_code} period={periodLabel} fieldDescription={`SUM of "Planned tests / procedures" column across all ${data.tests.length} diagnostic test rows for ${data.provider_code}`} sourceUrl={data.meta?.source_url} />
                    </p>
                    <p className="text-2xl font-bold text-foreground mt-1">{fmt(s.total_activity)}</p>
                    <p className="text-sm text-muted-foreground mt-0.5">tests completed this month</p>
                  </div>
                </div>
              </div>
              <div className="border-t border-border px-6 lg:px-8 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5"><Info className="h-3.5 w-3.5 text-primary" />Source: NHS England DM01 Monthly Diagnostics</span>
                <span>Operational Standard: &lt;1% should wait 6+ weeks</span>
                <a href="https://www.england.nhs.uk/statistics/statistical-work-areas/diagnostics-waiting-times-and-activity/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-primary hover:underline print:hidden">
                  View source data <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          );
        })()}

        {/* ── Diagnostic Test Breakdown ────────────────────── */}
        {data && !loading && (
          <div className="w-full bg-card rounded-xl border border-border shadow-sm print:shadow-none">
            <div className="p-6 lg:p-8 pb-4">
              <h3 className="text-xl font-bold text-foreground">Diagnostic Test Breakdown</h3>
              <p className="text-sm text-muted-foreground mt-1">Performance by modality against 6-week standard</p>
            </div>

            {/* Horizontal Bar Chart – scrollable on mobile */}
            <div className="px-6 lg:px-8 pb-6 overflow-x-auto">
              <div style={{ minWidth: 500 }}>
                <ResponsiveContainer width="100%" height={Math.max(chartData.length * 40, 200)}>
                  <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 60, left: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(var(--border))" />
                    <XAxis
                      type="number"
                      domain={[0, (max: number) => Math.ceil(max * 1.1) || 10]}
                      tickFormatter={(v: number) => `${v}%`}
                      tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                    />
                    <YAxis
                      type="category"
                      dataKey="name"
                      width={180}
                      tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                    />
                    <RechartsTooltip
                      content={({ active, payload }) => {
                        if (!active || !payload?.length || !data) return null;
                        const entry = payload[0].payload;
                        const [y, m] = data.period.split('-');
                        const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
                        const periodLabel = `${months[parseInt(m, 10) - 1]} ${y}`;
                        return (
                          <div className="rounded-lg p-3 shadow-lg border-0 text-xs leading-relaxed space-y-1.5" style={{ backgroundColor: '#1E293B', color: 'white', maxWidth: 380 }}>
                            <p className="font-semibold text-sm">{entry.fullName}: {entry.pct.toFixed(1)}%</p>
                            <div className="border-t border-white/20 pt-1.5 space-y-1">
                              <p><span className="mr-1.5">📄</span><span className="opacity-60">File:</span> Monthly Diagnostics – Provider – {periodLabel} (XLS)</p>
                              <p><span className="mr-1.5">📑</span><span className="opacity-60">Tab:</span> Provider by Test</p>
                              <p><span className="mr-1.5">🏥</span><span className="opacity-60">Provider:</span> {data.provider_name} ({data.provider_code})</p>
                              <p><span className="mr-1.5">🔬</span><span className="opacity-60">Test:</span> {entry.fullName}</p>
                              <p><span className="mr-1.5">📊</span><span className="opacity-60">Field:</span> "Percentage waiting 6+ weeks" column</p>
                              <p><span className="mr-1.5">🔗</span><span className="opacity-60">Source:</span> NHS England DM01 Monthly Diagnostics</p>
                            </div>
                          </div>
                        );
                      }}
                    />
                    <ReferenceLine x={1} stroke="#9CA3AF" strokeDasharray="6 4" label={{ value: '1% standard', position: 'top', fontSize: 10, fill: '#9CA3AF' }} />
                    <Bar dataKey="pct" radius={[0, 4, 4, 0]} barSize={24}>
                      {chartData.map((entry, i) => (
                        <Cell key={i} fill={getBarColor(entry.pct)} />
                      ))}
                      <LabelList dataKey="pct" position="right" formatter={(v: number) => `${v.toFixed(1)}%`} style={{ fontSize: 11, fill: 'hsl(var(--foreground))' }} />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Data Table – horizontally scrollable */}
            <div className="px-6 lg:px-8 pb-6 overflow-x-auto">
              <table className="w-full text-sm min-w-[600px]">
                <thead>
                  <tr className="border-b border-border">
                    <SortHeader label="Test Name" field="test_description" />
                    <SortHeader label="Waiting List" field="total_waiting_list" />
                    <SortHeader label="6+ Weeks" field="waiting_6_plus_weeks" />
                    <SortHeader label="% 6+ Weeks" field="percent_6_plus_weeks" />
                    <SortHeader label="Activity" field="total_activity" />
                  </tr>
                </thead>
                <tbody>
                  {sortedTests.map((t, i) => {
                    const prov = { providerName: data.provider_name, providerCode: data.provider_code, period: (() => { const [y, m] = data.period.split('-'); const months = ['January','February','March','April','May','June','July','August','September','October','November','December']; return `${months[parseInt(m, 10) - 1]} ${y}`; })(), tab: 'Provider by Test', sourceUrl: data.meta?.source_url };
                    return (
                      <tr key={t.test_code} className={i % 2 === 0 ? 'bg-muted/20' : ''}>
                        <td className="px-4 py-3 font-medium text-foreground">{t.test_description}</td>
                        <td className="px-4 py-3 text-foreground tabular-nums">
                          <span className="inline-flex items-center gap-1">
                            {fmt(t.total_waiting_list)}
                            <DataProvenanceTooltip {...prov} testName={t.test_description} fieldDescription={'"Total Waiting List" column'} />
                          </span>
                        </td>
                        <td className="px-4 py-3 text-foreground tabular-nums">
                          <span className="inline-flex items-center gap-1">
                            {fmt(t.waiting_6_plus_weeks)}
                            <DataProvenanceTooltip {...prov} testName={t.test_description} fieldDescription={'"Number waiting 6+ Weeks" column'} />
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${getBadgeClasses(t.percent_6_plus_weeks)}`}>
                            {t.percent_6_plus_weeks.toFixed(1)}%
                            <DataProvenanceTooltip {...prov} testName={t.test_description} fieldDescription={'"Percentage waiting 6+ weeks" column'} />
                          </span>
                        </td>
                        <td className="px-4 py-3 text-foreground tabular-nums">
                          <span className="inline-flex items-center gap-1">
                            {fmt(t.total_activity)}
                            <DataProvenanceTooltip {...prov} testName={t.test_description} fieldDescription={'"Planned tests / procedures" column'} />
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── Trend Analysis ─────────────────────────────── */}
        {data && !loading && trendData.length > 1 && (() => {
          const trendChartData = trendData.map(t => ({
            period: formatPeriodShort(t.period),
            pct: t.percent_6_plus_weeks,
          }));

          const current = trendData[trendData.length - 1];
          const previous = trendData.length >= 2 ? trendData[trendData.length - 2] : null;
          const momChange = previous ? Math.round((current.percent_6_plus_weeks - previous.percent_6_plus_weeks) * 100) / 100 : 0;

          const mid = Math.floor(trendData.length / 2);
          const firstHalfAvg = trendData.slice(0, mid).reduce((s, t) => s + t.percent_6_plus_weeks, 0) / mid;
          const secondHalfAvg = trendData.slice(mid).reduce((s, t) => s + t.percent_6_plus_weeks, 0) / (trendData.length - mid);
          const trendDirection = secondHalfAvg < firstHalfAvg - 0.5 ? 'Improving' : secondHalfAvg > firstHalfAvg + 0.5 ? 'Worsening' : 'Stable';

          const maxPct = Math.max(...trendData.map(t => t.percent_6_plus_weeks));

          return (
            <div className="w-full bg-card rounded-xl border border-border shadow-sm print:shadow-none">
              <div className="p-6 lg:p-8 pb-4">
                <h3 className="text-xl font-bold text-foreground">Trend Analysis</h3>
                <p className="text-sm text-muted-foreground mt-1">6+ week waiting percentage over time</p>
              </div>

              <div className="px-6 lg:px-8 pb-6">
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={trendChartData} margin={{ top: 10, right: 30, left: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="period" tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
                    <YAxis
                      domain={[0, Math.ceil(Math.max(maxPct * 1.2, 6))]}
                      tickFormatter={(v: number) => `${v}%`}
                      tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                    />
                    <RechartsTooltip
                      formatter={(value: number) => [`${value.toFixed(1)}%`, '6+ Weeks %']}
                      contentStyle={{ borderRadius: 8, border: '1px solid hsl(var(--border))', backgroundColor: 'hsl(var(--card))' }}
                    />
                    <ReferenceLine y={1} stroke="#EF4444" strokeDasharray="6 4" label={{ value: '1% Standard', position: 'right', fontSize: 10, fill: '#EF4444' }} />
                    <ReferenceLine y={5} stroke="#F59E0B" strokeDasharray="6 4" label={{ value: '5% At Risk', position: 'right', fontSize: 10, fill: '#F59E0B' }} />
                    <defs>
                      <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#005EB8" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#005EB8" stopOpacity={0.02} />
                      </linearGradient>
                    </defs>
                    <Area
                      type="monotone"
                      dataKey="pct"
                      stroke="#005EB8"
                      strokeWidth={2.5}
                      fill="url(#trendFill)"
                      dot={{ r: 5, fill: '#005EB8', stroke: '#fff', strokeWidth: 2 }}
                      activeDot={{ r: 7, fill: '#005EB8', stroke: '#fff', strokeWidth: 2 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="px-6 lg:px-8 pb-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="rounded-lg border border-border p-4">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Current Month</p>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-2xl font-bold text-foreground">{current.percent_6_plus_weeks.toFixed(1)}%</span>
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${getBadgeClasses(current.percent_6_plus_weeks)}`}>
                      {current.status}
                    </span>
                  </div>
                </div>

                <div className="rounded-lg border border-border p-4">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Month-on-Month Change</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-2xl font-bold text-foreground">
                      {momChange > 0 ? '+' : ''}{momChange.toFixed(1)}%
                    </span>
                    {momChange > 0.1 ? (
                      <TrendingUp className="h-5 w-5 text-destructive" />
                    ) : momChange < -0.1 ? (
                      <TrendingDown className="h-5 w-5 text-[#10B981]" />
                    ) : (
                      <Minus className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {momChange > 0.1 ? 'Increased from previous month' : momChange < -0.1 ? 'Decreased from previous month' : 'No significant change'}
                  </p>
                </div>

                <div className="rounded-lg border border-border p-4">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">6-Month Trend</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`text-2xl font-bold ${
                      trendDirection === 'Improving' ? 'text-[#10B981]' :
                      trendDirection === 'Worsening' ? 'text-destructive' : 'text-muted-foreground'
                    }`}>
                      {trendDirection}
                    </span>
                    {trendDirection === 'Improving' ? (
                      <TrendingDown className="h-5 w-5 text-[#10B981]" />
                    ) : trendDirection === 'Worsening' ? (
                      <TrendingUp className="h-5 w-5 text-destructive" />
                    ) : (
                      <Minus className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Based on {trendData.length}-month linear trend analysis
                  </p>
                </div>
              </div>
            </div>
          );
        })()}

        {/* Trend loading state */}
        {data && !loading && trendLoading && (
          <Card>
            <CardContent className="py-8 text-center">
              <RefreshCw className="h-6 w-6 animate-spin mx-auto text-primary mb-2" />
              <p className="text-sm text-muted-foreground">Loading trend data...</p>
            </CardContent>
          </Card>
        )}

        {/* ── Predictive Risk Assessment ──────────────────── */}
        {data && !loading && trendData.length > 2 && (
          <PredictiveRiskCard trendData={trendData} tests={data.tests} />
        )}

        {/* ── About This Data (collapsible) ──────────────── */}
        <Collapsible open={aboutOpen} onOpenChange={setAboutOpen} className="print:hidden">
          <div className="w-full bg-card rounded-xl border border-border shadow-sm">
            <CollapsibleTrigger asChild>
              <button className="w-full p-6 flex items-center justify-between text-left hover:bg-muted/30 transition-colors rounded-xl">
                <div className="flex items-center gap-2">
                  <Info className="h-5 w-5 text-primary" />
                  <span className="font-semibold text-foreground">About This Data</span>
                </div>
                <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${aboutOpen ? 'rotate-180' : ''}`} />
              </button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="px-6 pb-6 space-y-3 text-sm text-muted-foreground">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <p className="font-medium text-foreground">Data Source</p>
                    <p>NHS England Monthly Diagnostic Waiting Times and Activity (DM01)</p>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Collection</p>
                    <p>DM01 return, submitted by all NHS providers monthly</p>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Operational Standard</p>
                    <p>Less than 1% of patients should wait 6+ weeks for a diagnostic test</p>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Coverage</p>
                    <p>15 key diagnostic tests across ~133 acute trusts</p>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Publication</p>
                    <p>Monthly, typically 4-6 weeks after reporting period</p>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Guidance</p>
                    <a
                      href="https://www.england.nhs.uk/statistics/statistical-work-areas/diagnostics-waiting-times-and-activity/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline inline-flex items-center gap-1"
                    >
                      NHS England DM01 guidance <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>
              </div>
            </CollapsibleContent>
          </div>
        </Collapsible>
      </main>

      <div className="print:hidden">
        <StatusFooter onOpenMethodology={() => setIsMethodologyOpen(true)} />
      </div>
    </div>
  );
}
