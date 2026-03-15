import { memo, useMemo } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  AreaChart, Area, XAxis, YAxis, ReferenceLine, ResponsiveContainer,
  CartesianGrid, Tooltip as RechartsTooltip,
} from 'recharts';

interface TrendPoint {
  period: string;
  percent_6_plus_weeks: number;
  total_waiting_list: number;
  total_waiting_6_plus_weeks: number;
  total_activity: number;
  status: string;
}

interface TestRow {
  test_code: string;
  test_description: string;
  total_waiting_list: number;
  waiting_6_plus_weeks: number;
  percent_6_plus_weeks: number;
  total_activity: number;
}

interface PredictiveRiskCardProps {
  trendData: TrendPoint[];
  tests: TestRow[];
}

/* ── Linear regression helpers ─────────────────────────── */
function linearRegression(ys: number[]) {
  const n = ys.length;
  if (n < 2) return { slope: 0, intercept: ys[0] ?? 0, rSquared: 0 };

  let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;
  for (let i = 0; i < n; i++) {
    sumX += i;
    sumY += ys[i];
    sumXY += i * ys[i];
    sumXX += i * i;
  }
  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  // R²
  const mean = sumY / n;
  let ssTot = 0, ssRes = 0;
  for (let i = 0; i < n; i++) {
    ssTot += (ys[i] - mean) ** 2;
    ssRes += (ys[i] - (slope * i + intercept)) ** 2;
  }
  const rSquared = ssTot === 0 ? 1 : 1 - ssRes / ssTot;

  return { slope, intercept, rSquared };
}

function getStatusBand(pct: number) {
  if (pct <= 1) return 'operational';
  if (pct <= 5) return 'degraded';
  return 'atRisk';
}

const formatPeriodShort = (period: string) => {
  const [y, m] = period.split('-');
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return `${months[parseInt(m, 10) - 1]} ${y.slice(2)}`;
};

function nextPeriod(period: string, offset: number) {
  const [y, m] = period.split('-').map(Number);
  let month = m + offset;
  let year = y;
  while (month > 12) { month -= 12; year++; }
  while (month < 1) { month += 12; year--; }
  return `${year}-${String(month).padStart(2, '0')}`;
}

/* ── Component ─────────────────────────────────────────── */
const PredictiveRiskCard = memo(({ trendData, tests }: PredictiveRiskCardProps) => {
  const analysis = useMemo(() => {
    if (trendData.length < 2) return null;

    const values = trendData.map(t => t.percent_6_plus_weeks);
    const { slope, intercept, rSquared } = linearRegression(values);
    const n = values.length;

    const projected1 = Math.max(0, Math.round((slope * n + intercept) * 100) / 100);
    const projected2 = Math.max(0, Math.round((slope * (n + 1) + intercept) * 100) / 100);
    const currentVal = values[n - 1];
    const currentBand = getStatusBand(currentVal);
    const projectedBand = getStatusBand(projected1);

    // Risk level
    let riskLevel: 'low' | 'medium' | 'high';
    if (slope <= 0 || projectedBand === 'operational') {
      riskLevel = 'low';
    } else if (projectedBand !== currentBand) {
      riskLevel = 'high';
    } else {
      riskLevel = 'medium';
    }

    // Confidence
    const confidence = rSquared > 0.7 ? 'High' : rSquared > 0.3 ? 'Medium' : 'Low';

    // Trend label
    const trendLabel = slope < -0.1 ? 'Improving' : slope > 0.1 ? 'Worsening' : 'Stable';

    // Chart data: historical + 2 projected
    const lastPeriod = trendData[n - 1].period;
    const chartPoints = trendData.map(t => ({
      period: formatPeriodShort(t.period),
      actual: t.percent_6_plus_weeks,
      projected: null as number | null,
    }));
    // Bridge: last actual point also starts the projection
    chartPoints[chartPoints.length - 1].projected = currentVal;
    chartPoints.push({
      period: formatPeriodShort(nextPeriod(lastPeriod, 1)),
      actual: null as number | null,
      projected: projected1,
    });
    chartPoints.push({
      period: formatPeriodShort(nextPeriod(lastPeriod, 2)),
      actual: null as number | null,
      projected: projected2,
    });

    // Top 3 worst tests
    const worstTests = [...tests]
      .sort((a, b) => b.percent_6_plus_weeks - a.percent_6_plus_weeks)
      .slice(0, 3);

    return {
      projected1,
      slope: Math.round(slope * 100) / 100,
      rSquared: Math.round(rSquared * 100) / 100,
      confidence,
      trendLabel,
      riskLevel,
      chartPoints,
      worstTests,
      maxPct: Math.max(...values, projected1, projected2, 6),
    };
  }, [trendData, tests]);

  if (!analysis) return null;

  const riskColors = {
    low: { border: '#10B981', bg: 'bg-[#10B981]/10', text: 'text-[#059669]', label: 'Low Risk' },
    medium: { border: '#F59E0B', bg: 'bg-[#F59E0B]/10', text: 'text-[#D97706]', label: 'Medium Risk' },
    high: { border: '#EF4444', bg: 'bg-[#EF4444]/10', text: 'text-[#DC2626]', label: 'High Risk' },
  };
  const risk = riskColors[analysis.riskLevel];

  return (
    <div
      className="w-full bg-[#FAF5FF] rounded-xl border border-border shadow-sm"
      style={{ borderLeft: `4px solid #7C3AED` }}
    >
      {/* Header */}
      <div className="p-6 lg:p-8 pb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <TrendingUp className="h-6 w-6" style={{ color: '#7C3AED' }} />
          <h3 className="text-xl font-bold text-foreground">Diagnostic Access Risk Forecast</h3>
          <Badge className="bg-primary/10 text-primary hover:bg-primary/20 text-xs font-medium">BETA</Badge>
        </div>
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${risk.bg} ${risk.text}`}>
          {risk.label}
        </span>
      </div>

      {/* Projection summary */}
      <div className="px-6 lg:px-8 pb-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Projected Next Month</p>
          <p className="text-2xl font-bold mt-1" style={{ color: '#7C3AED' }}>
            {analysis.projected1.toFixed(1)}%
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">waiting 6+ weeks</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Current Trend</p>
          <div className="flex items-center gap-2 mt-1">
            <span className={`text-xl font-bold ${
              analysis.trendLabel === 'Improving' ? 'text-[#10B981]' :
              analysis.trendLabel === 'Worsening' ? 'text-destructive' : 'text-muted-foreground'
            }`}>
              {analysis.trendLabel}
            </span>
            {analysis.trendLabel === 'Improving' ? <TrendingDown className="h-5 w-5 text-[#10B981]" /> :
             analysis.trendLabel === 'Worsening' ? <TrendingUp className="h-5 w-5 text-destructive" /> :
             <Minus className="h-5 w-5 text-muted-foreground" />}
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            {analysis.slope > 0 ? '+' : ''}{analysis.slope}% per month
          </p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Confidence</p>
          <p className={`text-xl font-bold mt-1 ${
            analysis.confidence === 'High' ? 'text-[#10B981]' :
            analysis.confidence === 'Medium' ? 'text-[#F59E0B]' : 'text-destructive'
          }`}>
            {analysis.confidence}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">R² = {analysis.rSquared}</p>
        </div>
      </div>

      {/* Mini projection chart */}
      <div className="px-6 lg:px-8 pb-6">
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={analysis.chartPoints} margin={{ top: 10, right: 30, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="period" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
            <YAxis
              domain={[0, Math.ceil(analysis.maxPct * 1.2)]}
              tickFormatter={(v: number) => `${v}%`}
              tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
            />
            <RechartsTooltip
              formatter={(value: number, name: string) => [
                `${value.toFixed(1)}%`,
                name === 'actual' ? 'Actual' : 'Projected',
              ]}
              contentStyle={{ borderRadius: 8, border: '1px solid hsl(var(--border))', backgroundColor: 'hsl(var(--card))' }}
            />
            <ReferenceLine y={1} stroke="#EF4444" strokeDasharray="6 4" label={{ value: '1%', position: 'right', fontSize: 10, fill: '#EF4444' }} />
            <ReferenceLine y={5} stroke="#F59E0B" strokeDasharray="6 4" label={{ value: '5%', position: 'right', fontSize: 10, fill: '#F59E0B' }} />
            <defs>
              <linearGradient id="actualFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#005EB8" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#005EB8" stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="projFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#7C3AED" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="actual"
              stroke="#005EB8"
              strokeWidth={2.5}
              fill="url(#actualFill)"
              dot={{ r: 4, fill: '#005EB8', stroke: '#fff', strokeWidth: 2 }}
              connectNulls={false}
            />
            <Area
              type="monotone"
              dataKey="projected"
              stroke="#7C3AED"
              strokeWidth={2.5}
              strokeDasharray="8 4"
              fill="url(#projFill)"
              dot={{ r: 4, fill: '#7C3AED', stroke: '#fff', strokeWidth: 2 }}
              connectNulls={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Key Risk Drivers */}
      {analysis.worstTests.length > 0 && (
        <div className="px-6 lg:px-8 pb-6">
          <h4 className="font-bold text-sm text-foreground mb-3 flex items-center gap-2">
            <span>⚡</span> Modalities Driving Highest Breach Rates
          </h4>
          <div className="space-y-2">
            {analysis.worstTests.map((t) => (
              <div key={t.test_code} className="flex items-center justify-between rounded-lg border border-border bg-card px-4 py-3">
                <span className="text-sm font-medium text-foreground">{t.test_description}</span>
                <div className="flex items-center gap-3">
                  <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                    t.percent_6_plus_weeks <= 1 ? 'bg-[#10B981]/10 text-[#059669]' :
                    t.percent_6_plus_weeks <= 5 ? 'bg-[#F59E0B]/10 text-[#D97706]' :
                    'bg-[#EF4444]/10 text-[#DC2626]'
                  }`}>
                    {t.percent_6_plus_weeks.toFixed(1)}%
                  </span>
                  {t.percent_6_plus_weeks > 5 ? <TrendingUp className="h-4 w-4 text-destructive" /> :
                   t.percent_6_plus_weeks <= 1 ? <TrendingDown className="h-4 w-4 text-[#10B981]" /> :
                   <Minus className="h-4 w-4 text-muted-foreground" />}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer disclaimer */}
      <div className="px-6 lg:px-8 pb-6">
        <p className="text-xs text-muted-foreground italic leading-relaxed">
          Projection based on linear trend extrapolation of published NHS England DM01 data. This is statistical extrapolation, not predictive modelling. Actual outcomes depend on trust operational decisions, seasonal factors, and policy changes.
        </p>
      </div>
    </div>
  );
});

PredictiveRiskCard.displayName = 'PredictiveRiskCard';

export default PredictiveRiskCard;
