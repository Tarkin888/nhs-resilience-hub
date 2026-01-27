import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';
import { TrendingUp, TrendingDown, Minus, Info, BarChart3 } from 'lucide-react';
import { DetailedEssentialService, ServiceMetric } from '@/types/services';
import { cn } from '@/lib/utils';

interface PerformanceMetricsCardProps {
  service: DetailedEssentialService;
}

const MetricCard = ({ metric }: { metric: ServiceMetric }) => {
  const getTrendIcon = () => {
    switch (metric.trend) {
      case 'improving':
        return <TrendingUp className="h-4 w-4 text-success" />;
      case 'declining':
        return <TrendingDown className="h-4 w-4 text-destructive" />;
      default:
        return <Minus className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = () => {
    const config = {
      green: { label: 'On Target', className: 'bg-success text-success-foreground' },
      amber: { label: 'At Risk', className: 'bg-warning text-warning-foreground' },
      red: { label: 'Below Target', className: 'bg-destructive text-destructive-foreground' },
    }[metric.status];

    return (
      <Badge className={cn('text-xs', config.className)}>
        {config.label}
      </Badge>
    );
  };

  const chartColor = {
    green: 'hsl(var(--success))',
    amber: 'hsl(var(--warning))',
    red: 'hsl(var(--destructive))',
  }[metric.status];

  return (
    <div className="bg-background border rounded-lg p-4">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <h4 className="font-semibold text-foreground text-sm">{metric.name}</h4>
          <Tooltip>
            <TooltipTrigger>
              <Info className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground" />
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p className="font-medium mb-1">Data Source</p>
              <p className="text-xs">{metric.dataSource}</p>
            </TooltipContent>
          </Tooltip>
        </div>
        {getStatusBadge()}
      </div>

      <div className="flex items-baseline gap-2 mb-2">
        <span className="text-2xl font-bold text-foreground">{metric.currentValue}</span>
        <span className="text-sm text-muted-foreground">/ {metric.target}</span>
        <div className="flex items-center gap-1 ml-auto">
          {getTrendIcon()}
          <span className="text-xs text-muted-foreground capitalize">{metric.trend}</span>
        </div>
      </div>

      {/* Mini Chart */}
      <div className="h-16 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={metric.history}>
            <XAxis dataKey="date" hide />
            <YAxis hide domain={['auto', 'auto']} />
            <RechartsTooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--popover))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '6px',
                fontSize: '12px'
              }}
              formatter={(value: number) => [value.toFixed(1), metric.name]}
              labelFormatter={(label) => {
                const date = new Date(label);
                return date.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' });
              }}
            />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke={chartColor}
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const PerformanceMetricsCard = ({ service }: PerformanceMetricsCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-primary" />
          Current Performance Metrics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {service.metrics.map((metric, index) => (
            <MetricCard key={index} metric={metric} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PerformanceMetricsCard;
