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
              <p className="text-muted-foreground">
                Fetching DM01 data for {currentProvider?.name}…
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                This may take a moment while we download and parse the NHS England
                spreadsheet.
              </p>
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
                <p className="text-sm text-muted-foreground mt-1">
                  Click "Fetch Latest Data" to fetch the latest DM01 data from NHS
                  England.
                </p>
              </div>
              <Button
                onClick={() => fetchData()}
                className="gap-2"
                style={{ backgroundColor: '#005EB8' }}
              >
                <Database className="h-4 w-4" />
                Fetch Latest Data
              </Button>
            </CardContent>
          </Card>
        )}

        {/* ── Data Display (placeholder for next prompt) ─── */}
        {data && !loading && (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="font-medium text-foreground">
                Data loaded for {data.provider_name} — {data.period}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {data.tests.length} diagnostic tests found | Status:{' '}
                <span
                  className="font-semibold"
                  style={{
                    color:
                      data.summary.status === 'Operational'
                        ? '#00A651'
                        : data.summary.status === 'Degraded'
                        ? '#FFB81C'
                        : '#DA291C',
                  }}
                >
                  {data.summary.status}
                </span>
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Full data visualisation will be added in the next update.
              </p>
            </CardContent>
          </Card>
        )}
      </main>

      <StatusFooter onOpenMethodology={() => setIsMethodologyOpen(true)} />
    </div>
  );
}
