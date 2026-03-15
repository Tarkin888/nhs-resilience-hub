import { useState } from 'react';
import { Radio, Database, RefreshCw, CheckCircle, AlertTriangle, XCircle, Info, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Header from '@/components/Header';
import StatusFooter from '@/components/StatusFooter';
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

export default function LiveData() {
  const [isMethodologyOpen, setIsMethodologyOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState('R0A');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<DM01Response | null>(null);
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

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

  const currentProvider = PROVIDERS.find((p) => p.code === selectedProvider);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header
        isMethodologyOpen={isMethodologyOpen}
        onMethodologyOpenChange={setIsMethodologyOpen}
      />

      <main className="flex-1 max-w-[1400px] mx-auto w-full px-4 md:px-8 py-6 space-y-6">
        {/* ── Live Data Banner ─────────────────────────────── */}
        <div
          className="w-full rounded-lg px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
          style={{
            backgroundColor: '#E8F5E9',
            borderLeft: '4px solid #2E7D32',
          }}
        >
          <div className="flex items-center gap-2">
            <Radio className="h-5 w-5" style={{ color: '#2E7D32' }} />
            <span className="font-semibold text-sm" style={{ color: '#2E7D32' }}>
              LIVE DATA
            </span>
            <span className="text-sm" style={{ color: '#1B5E20' }}>
              | Sourced from NHS England Monthly Diagnostics (DM01)
            </span>
          </div>
          <div className="flex items-center gap-3">
            {lastRefreshed && (
              <span className="text-xs" style={{ color: '#2E7D32' }}>
                Last refreshed: {lastRefreshed.toLocaleTimeString()}
              </span>
            )}
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 border-[#2E7D32] text-[#2E7D32] hover:bg-[#C8E6C9]"
              onClick={() => fetchData()}
              disabled={loading}
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
              Refresh Data
            </Button>
          </div>
        </div>

        {/* ── Page Header + Provider Selector ─────────────── */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-foreground">
              Diagnostics Access Performance
            </h2>
            <p className="text-muted-foreground mt-1">
              Monthly Diagnostic Waiting Times and Activity (DM01)
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Source: NHS England Official Statistics | Operational Standard: &lt;1%
              waiting 6+ weeks
            </p>
          </div>

          <Select value={selectedProvider} onValueChange={handleProviderChange}>
            <SelectTrigger className="w-full md:w-[340px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PROVIDERS.map((p) => (
                <SelectItem key={p.code} value={p.code}>
                  {p.name} ({p.code})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* ── Error State ─────────────────────────────────── */}
        {error && (
          <Card className="border-destructive/50 bg-destructive/5">
            <CardContent className="py-6 text-center text-destructive">
              <p className="font-medium">{error}</p>
              <p className="text-sm mt-1 text-muted-foreground">
                Try refreshing or selecting a different provider.
              </p>
            </CardContent>
          </Card>
        )}

        {/* ── Loading State ───────────────────────────────── */}
        {loading && (
          <Card>
            <CardContent className="py-12 text-center">
              <RefreshCw className="h-8 w-8 animate-spin mx-auto text-primary mb-3" />
              <p className="font-medium text-foreground">Fetching data from NHS England...</p>
              <p className="text-xs text-muted-foreground mt-1">
                This may take a moment while we download and parse the NHS England spreadsheet.
              </p>
            </CardContent>
          </Card>
        )}

        {/* ── Diagnostics Status Tile ─────────────────────── */}
        {data && !loading && (() => {
          const s = data.summary;
          const statusColor = s.status === 'Operational' ? '#00A651' : s.status === 'Degraded' ? '#FFB81C' : '#DA291C';
          const StatusIcon = s.status === 'Operational' ? CheckCircle : s.status === 'Degraded' ? AlertTriangle : XCircle;
          const statusTextColor = s.status === 'Degraded' ? '#212B32' : '#FFFFFF';
          const fmt = (n: number) => n.toLocaleString('en-GB');
          const periodLabel = (() => {
            const [y, m] = data.period.split('-');
            const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
            return `${months[parseInt(m, 10) - 1]} ${y}`;
          })();

          return (
            <div
              className="w-full bg-card rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow"
              style={{ borderLeft: `4px solid ${statusColor}` }}
            >
              <div className="flex flex-col lg:flex-row">
                {/* Left Section */}
                <div className="flex-[3] p-6 lg:p-8 flex flex-col justify-center gap-4">
                  <div>
                    <h3 className="text-2xl font-bold text-foreground">{data.provider_name}</h3>
                    <p className="text-muted-foreground mt-1">{periodLabel}</p>
                  </div>
                  <div
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-base font-semibold w-fit"
                    style={{ backgroundColor: statusColor, color: statusTextColor }}
                  >
                    <StatusIcon className="h-5 w-5" />
                    {s.status}
                  </div>
                </div>

                {/* Right Section – Metric Cards */}
                <div className="flex-[2] p-6 lg:p-8 flex flex-col gap-3 lg:border-l border-border">
                  {/* Key Metric */}
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

              {/* Footer */}
              <div className="border-t border-border px-6 lg:px-8 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Info className="h-3.5 w-3.5 text-primary" />
                  Source: NHS England DM01 Monthly Diagnostics
                </span>
                <span>Operational Standard: &lt;1% should wait 6+ weeks</span>
                <a
                  href="https://www.england.nhs.uk/statistics/statistical-work-areas/diagnostics-waiting-times-and-activity/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-primary hover:underline"
                >
                  View source data <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          );
        })()}
      </main>

      <StatusFooter onOpenMethodology={() => setIsMethodologyOpen(true)} />
    </div>
  );
}
