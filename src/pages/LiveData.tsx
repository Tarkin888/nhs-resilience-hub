import { useState, useMemo, useCallback } from 'react';
import { Radio, Database, RefreshCw, CheckCircle, AlertTriangle, XCircle, Info, ExternalLink, ArrowUpDown, TrendingUp, TrendingDown, Minus } from 'lucide-react';
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
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ReferenceLine, ResponsiveContainer, Cell, LabelList,
  LineChart, Line, Area, AreaChart,
} from 'recharts';
import Header from '@/components/Header';
import StatusFooter from '@/components/StatusFooter';
import PredictiveRiskCard from '@/components/live-data/PredictiveRiskCard';
import { supabase } from '@/integrations/supabase/client';

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

export default function LiveData() {
  const [isMethodologyOpen, setIsMethodologyOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState('R0A');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<DM01Response | null>(null);
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [sortKey, setSortKey] = useState<SortKey>('percent_6_plus_weeks');
  const [sortAsc, setSortAsc] = useState(false);
  const [trendData, setTrendData] = useState<TrendPoint[]>([]);
  const [trendLoading, setTrendLoading] = useState(false);

  const fetchTrend = useCallback(async (providerCode: string) => {
    setTrendLoading(true);
    try {
      const { data: result, error: fnError } = await supabase.functions.invoke(
        'fetch-dm01-history',
        { body: { providerCode, period: '2025-07' } }
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
    setLoading(true);
    setError(null);
    try {
      const { data: result, error: fnError } = await supabase.functions.invoke(
        'fetch-dm01-data',
        { body: { providerCode: code, period: '2025-07' } }
      );
      if (fnError) throw fnError;
      if (result?.error) {
        setError(result.error);
        setData(null);
      } else {
        setData(result as DM01Response);
        setLastRefreshed(new Date());
        // Fetch trend data after main data is loaded
        fetchTrend(code);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
      setData(null);
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
      .sort((a, b) => a.percent_6_plus_weeks - b.percent_6_plus_weeks)
      .map((t) => ({ name: truncate(t.test_description, 25), pct: t.percent_6_plus_weeks }));
  }, [data]);

  const currentProvider = PROVIDERS.find((p) => p.code === selectedProvider);

  const SortHeader = ({ label, field }: { label: string; field: SortKey }) => (
    <th
      className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer hover:text-foreground select-none"
      onClick={() => handleSort(field)}
    >
      <span className="inline-flex items-center gap-1">
        {label}
        <ArrowUpDown className={`h-3 w-3 ${sortKey === field ? 'text-primary' : 'text-muted-foreground/40'}`} />
      </span>
    </th>
  );

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header isMethodologyOpen={isMethodologyOpen} onMethodologyOpenChange={setIsMethodologyOpen} />

      <main className="flex-1 max-w-[1400px] mx-auto w-full px-4 md:px-8 py-6 space-y-6">
        {/* ── Live Data Banner ─────────────────────────────── */}
        <div
          className="w-full rounded-lg px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
          style={{ backgroundColor: '#E8F5E9', borderLeft: '4px solid #2E7D32' }}
        >
          <div className="flex items-center gap-2">
            <Radio className="h-5 w-5" style={{ color: '#2E7D32' }} />
            <span className="font-semibold text-sm" style={{ color: '#2E7D32' }}>LIVE DATA</span>
            <span className="text-sm" style={{ color: '#1B5E20' }}>| Sourced from NHS England Monthly Diagnostics (DM01)</span>
          </div>
          <div className="flex items-center gap-3">
            {lastRefreshed && (
              <span className="text-xs" style={{ color: '#2E7D32' }}>Last refreshed: {lastRefreshed.toLocaleTimeString()}</span>
            )}
            <Button variant="outline" size="sm" className="gap-1.5 border-[#2E7D32] text-[#2E7D32] hover:bg-[#C8E6C9]" onClick={() => fetchData()} disabled={loading}>
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
              Refresh Data
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
          <Select value={selectedProvider} onValueChange={handleProviderChange}>
            <SelectTrigger className="w-full md:w-[340px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              {PROVIDERS.map((p) => (
                <SelectItem key={p.code} value={p.code}>{p.name} ({p.code})</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* ── Error State ─────────────────────────────────── */}
        {error && (
          <Card className="border-destructive/50 bg-destructive/5">
            <CardContent className="py-6 text-center text-destructive">
              <p className="font-medium">{error}</p>
              <p className="text-sm mt-1 text-muted-foreground">Try refreshing or selecting a different provider.</p>
            </CardContent>
          </Card>
        )}

        {/* ── Loading State ───────────────────────────────── */}
        {loading && (
          <Card>
            <CardContent className="py-12 text-center">
              <RefreshCw className="h-8 w-8 animate-spin mx-auto text-primary mb-3" />
              <p className="font-medium text-foreground">Fetching data from NHS England...</p>
              <p className="text-xs text-muted-foreground mt-1">This may take a moment while we download and parse the NHS England spreadsheet.</p>
            </CardContent>
          </Card>
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
            <div className="w-full bg-card rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow" style={{ borderLeft: `4px solid ${statusColor}` }}>
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
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Patients Waiting 6+ Weeks</p>
                    <p className="text-3xl font-bold mt-1" style={{ color: statusColor }}>{fmt(s.total_waiting_6_plus_weeks)}</p>
                    <p className="text-sm text-muted-foreground mt-0.5">{s.percent_6_plus_weeks.toFixed(1)}% of waiting list</p>
                  </div>
                  <div className="rounded-lg border border-border bg-muted/30 p-4">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Total Waiting List</p>
                    <p className="text-2xl font-bold text-foreground mt-1">{fmt(s.total_waiting_list)}</p>
                    <p className="text-sm text-muted-foreground mt-0.5">patients across {data.tests.length} tests</p>
                  </div>
                  <div className="rounded-lg border border-border bg-muted/30 p-4">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Monthly Activity</p>
                    <p className="text-2xl font-bold text-foreground mt-1">{fmt(s.total_activity)}</p>
                    <p className="text-sm text-muted-foreground mt-0.5">tests completed this month</p>
                  </div>
                </div>
              </div>
              <div className="border-t border-border px-6 lg:px-8 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5"><Info className="h-3.5 w-3.5 text-primary" />Source: NHS England DM01 Monthly Diagnostics</span>
                <span>Operational Standard: &lt;1% should wait 6+ weeks</span>
                <a href="https://www.england.nhs.uk/statistics/statistical-work-areas/diagnostics-waiting-times-and-activity/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-primary hover:underline">
                  View source data <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          );
        })()}

        {/* ── Diagnostic Test Breakdown ────────────────────── */}
        {data && !loading && (
          <div className="w-full bg-card rounded-xl border border-border shadow-sm">
            {/* Section Header */}
            <div className="p-6 lg:p-8 pb-4">
              <h3 className="text-xl font-bold text-foreground">Diagnostic Test Breakdown</h3>
              <p className="text-sm text-muted-foreground mt-1">Performance by modality against 6-week standard</p>
            </div>

            {/* Horizontal Bar Chart */}
            <div className="px-6 lg:px-8 pb-6">
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
                    formatter={(value: number) => [`${value.toFixed(1)}%`, '6+ Weeks %']}
                    contentStyle={{ borderRadius: 8, border: '1px solid hsl(var(--border))', backgroundColor: 'hsl(var(--card))' }}
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

            {/* Data Table */}
            <div className="px-6 lg:px-8 pb-6 overflow-x-auto">
              <table className="w-full text-sm">
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
                  {sortedTests.map((t, i) => (
                    <tr key={t.test_code} className={i % 2 === 0 ? 'bg-muted/20' : ''}>
                      <td className="px-4 py-3 font-medium text-foreground">{t.test_description}</td>
                      <td className="px-4 py-3 text-foreground tabular-nums">{fmt(t.total_waiting_list)}</td>
                      <td className="px-4 py-3 text-foreground tabular-nums">{fmt(t.waiting_6_plus_weeks)}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${getBadgeClasses(t.percent_6_plus_weeks)}`}>
                          {t.percent_6_plus_weeks.toFixed(1)}%
                        </span>
                      </td>
                      <td className="px-4 py-3 text-foreground tabular-nums">{fmt(t.total_activity)}</td>
                    </tr>
                  ))}
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

          // Simple linear trend: compare first half avg to second half avg
          const mid = Math.floor(trendData.length / 2);
          const firstHalfAvg = trendData.slice(0, mid).reduce((s, t) => s + t.percent_6_plus_weeks, 0) / mid;
          const secondHalfAvg = trendData.slice(mid).reduce((s, t) => s + t.percent_6_plus_weeks, 0) / (trendData.length - mid);
          const trendDirection = secondHalfAvg < firstHalfAvg - 0.5 ? 'Improving' : secondHalfAvg > firstHalfAvg + 0.5 ? 'Worsening' : 'Stable';

          const maxPct = Math.max(...trendData.map(t => t.percent_6_plus_weeks));

          return (
            <div className="w-full bg-card rounded-xl border border-border shadow-sm">
              <div className="p-6 lg:p-8 pb-4">
                <h3 className="text-xl font-bold text-foreground">Trend Analysis</h3>
                <p className="text-sm text-muted-foreground mt-1">6+ week waiting percentage over time</p>
              </div>

              {/* Line/Area Chart */}
              <div className="px-6 lg:px-8 pb-6">
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={trendChartData} margin={{ top: 10, right: 30, left: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis
                      dataKey="period"
                      tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                    />
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

              {/* Trend Summary Cards */}
              <div className="px-6 lg:px-8 pb-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Current Month */}
                <div className="rounded-lg border border-border p-4">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Current Month</p>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-2xl font-bold text-foreground">{current.percent_6_plus_weeks.toFixed(1)}%</span>
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${getBadgeClasses(current.percent_6_plus_weeks)}`}>
                      {current.status}
                    </span>
                  </div>
                </div>

                {/* Month-on-Month Change */}
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

                {/* 6-Month Trend */}
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
      </main>

      <StatusFooter onOpenMethodology={() => setIsMethodologyOpen(true)} />
    </div>
  );
}
