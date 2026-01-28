import { useState, useMemo } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { format, formatDistanceToNow } from 'date-fns';
import { 
  ChevronRight, 
  ChevronLeft, 
  Download,
  Calendar,
  Users,
  TrendingDown,
  TrendingUp,
  Minus,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  ChevronDown
} from 'lucide-react';
import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend
} from 'recharts';
import DemoBanner from '@/components/DemoBanner';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { getExerciseResultById } from '@/lib/exercisesData';
import { cn } from '@/lib/utils';
import DataSourcesModal from '@/components/DataSourcesModal';

const ExerciseResults = () => {
  const { resultId } = useParams<{ resultId: string }>();
  const [isMethodologyOpen, setIsMethodologyOpen] = useState(false);
  const [isDataSourcesOpen, setIsDataSourcesOpen] = useState(false);
  const [severityFilter, setSeverityFilter] = useState<string>('all');

  const result = resultId ? getExerciseResultById(resultId) : undefined;

  if (!result) {
    return <Navigate to="/scenarios/exercises" replace />;
  }

  const filteredVulnerabilities = useMemo(() => {
    if (severityFilter === 'all') return result.vulnerabilities;
    return result.vulnerabilities.filter(v => v.severity === severityFilter);
  }, [result.vulnerabilities, severityFilter]);

  const getOutcomeBadge = (outcome: 'well-managed' | 'adequate' | 'poor') => {
    const config = {
      'well-managed': { 
        label: 'Well Managed', 
        className: 'bg-success text-success-foreground text-lg px-4 py-2'
      },
      'adequate': { 
        label: 'Adequate', 
        className: 'bg-warning text-warning-foreground text-lg px-4 py-2'
      },
      'poor': { 
        label: 'Poor', 
        className: 'bg-destructive text-destructive-foreground text-lg px-4 py-2'
      }
    }[outcome];

    return <Badge className={cn('font-semibold', config.className)}>{config.label}</Badge>;
  };

  const getSeverityBadge = (severity: 'critical' | 'high' | 'medium' | 'low') => {
    const config = {
      critical: { label: 'Critical', className: 'bg-destructive text-destructive-foreground' },
      high: { label: 'High', className: 'bg-warning text-warning-foreground' },
      medium: { label: 'Medium', className: 'bg-[#2196F3] text-white' },
      low: { label: 'Low', className: 'bg-muted text-muted-foreground' }
    }[severity];

    return <Badge className={cn('font-medium', config.className)}>{config.label}</Badge>;
  };

  const getStatusBadge = (status: string) => {
    const config: Record<string, { label: string; className: string }> = {
      'identified': { label: 'Identified', className: 'bg-muted text-muted-foreground' },
      'planned': { label: 'Planned', className: 'bg-[#2196F3]/20 text-[#2196F3] border-[#2196F3]' },
      'in-progress': { label: 'In Progress', className: 'bg-warning/20 text-warning border-warning' },
      'completed': { label: 'Completed', className: 'bg-success/20 text-success border-success' },
      'not-started': { label: 'Not Started', className: 'bg-muted text-muted-foreground' }
    };

    const cfg = config[status] || config['identified'];
    return <Badge variant="outline" className={cn('font-medium', cfg.className)}>{cfg.label}</Badge>;
  };

  const getDecisionOutcomeBadge = (outcome: 'positive' | 'neutral' | 'negative') => {
    const config = {
      positive: { label: 'Positive', className: 'bg-success/20 text-success border-success', icon: CheckCircle },
      neutral: { label: 'Neutral', className: 'bg-muted text-muted-foreground', icon: Minus },
      negative: { label: 'Negative', className: 'bg-destructive/20 text-destructive border-destructive', icon: XCircle }
    }[outcome];

    const Icon = config.icon;
    return (
      <Badge variant="outline" className={cn('font-medium gap-1', config.className)}>
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  // Prepare chart data
  const chartData = result.impactAnalysis.map(impact => ({
    name: impact.capitalName.replace(' Capital', ''),
    pre: impact.preScore,
    post: impact.postScore,
    change: impact.change
  }));

  const getActionProgress = () => {
    const completed = result.actions.filter(a => a.status === 'completed').length;
    const total = result.actions.length;
    return Math.round((completed / total) * 100);
  };

  const exportVulnerabilitiesToCSV = () => {
    const headers = ['Description', 'Severity', 'Mitigation', 'Owner', 'Due Date', 'Status'];
    const rows = result.vulnerabilities.map(v => [
      v.description,
      v.severity,
      v.mitigation,
      v.owner,
      format(v.dueDate, 'yyyy-MM-dd'),
      v.status
    ]);
    
    const csvContent = [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vulnerabilities-${result.exerciseName.replace(/\s+/g, '-').toLowerCase()}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-background">
      <DemoBanner 
        onOpenMethodology={() => setIsMethodologyOpen(true)} 
        onOpenDataSources={() => setIsDataSourcesOpen(true)}
      />
      
      <Header 
        isMethodologyOpen={isMethodologyOpen} 
        onMethodologyOpenChange={setIsMethodologyOpen}
      />

      <main className="max-w-[1400px] mx-auto px-4 md:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link to="/" className="hover:text-foreground transition-colors">
            Dashboard
          </Link>
          <ChevronRight className="h-4 w-4" />
          <Link to="/scenarios/exercises" className="hover:text-foreground transition-colors">
            Exercise Library
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground font-medium">Results</span>
        </nav>

        {/* Back Button */}
        <Link 
          to="/scenarios/exercises"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Exercise Library
        </Link>

        {/* Executive Summary Card */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
              <div>
                <CardTitle className="text-2xl mb-2">{result.exerciseName}</CardTitle>
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4" />
                    <span>{format(result.date, 'dd MMMM yyyy')}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users className="h-4 w-4" />
                    <span>{result.participants.join(', ')}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                {getOutcomeBadge(result.outcome)}
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Impact Analysis Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Impact Analysis</CardTitle>
            <p className="text-sm text-muted-foreground">
              Capital scores before and after the scenario exercise
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Chart */}
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} layout="vertical" barGap={4}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                    <XAxis type="number" domain={[0, 100]} />
                    <YAxis type="category" dataKey="name" width={100} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Legend />
                    <Bar dataKey="pre" name="Pre-Scenario" fill="#2196F3" radius={[0, 4, 4, 0]} />
                    <Bar dataKey="post" name="Post-Scenario" fill="#F44336" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Table */}
              <div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Capital</TableHead>
                      <TableHead className="text-right">Pre</TableHead>
                      <TableHead className="text-right">Post</TableHead>
                      <TableHead className="text-right">Change</TableHead>
                      <TableHead className="text-right">Recovery</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {result.impactAnalysis.map((impact) => (
                      <TableRow key={impact.capitalName}>
                        <TableCell className="font-medium">{impact.capitalName}</TableCell>
                        <TableCell className="text-right">{impact.preScore}</TableCell>
                        <TableCell className="text-right">{impact.postScore}</TableCell>
                        <TableCell className="text-right">
                          <span className={cn(
                            'flex items-center justify-end gap-1',
                            impact.change > 0 ? 'text-success' : impact.change < 0 ? 'text-destructive' : ''
                          )}>
                            {impact.change > 0 ? (
                              <TrendingUp className="h-4 w-4" />
                            ) : impact.change < 0 ? (
                              <TrendingDown className="h-4 w-4" />
                            ) : (
                              <Minus className="h-4 w-4" />
                            )}
                            {impact.change > 0 ? '+' : ''}{impact.change}
                          </span>
                        </TableCell>
                        <TableCell className="text-right text-muted-foreground">
                          {impact.recoveryTime}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Decision Review Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Decision Review</CardTitle>
            <p className="text-sm text-muted-foreground">
              Key decisions made during the exercise and their outcomes
            </p>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="space-y-2">
              {result.decisionsReviewed.map((decision) => (
                <AccordionItem 
                  key={decision.id} 
                  value={decision.id}
                  className="border rounded-lg px-4"
                >
                  <AccordionTrigger className="hover:no-underline py-4">
                    <div className="flex items-start gap-4 text-left">
                      <div className="flex-1">
                        <p className="font-medium">{decision.description}</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Choice: <span className="text-foreground">{decision.choiceMade}</span>
                        </p>
                      </div>
                      {getDecisionOutcomeBadge(decision.outcome)}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-4">
                    <div className="space-y-4 pt-2">
                      <div>
                        <h4 className="text-sm font-medium mb-2">Alternative Options Considered:</h4>
                        <ul className="space-y-1">
                          {decision.alternatives.map((alt, idx) => (
                            <li key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                              <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground" />
                              {alt}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                        <h4 className="text-sm font-medium text-primary mb-1">Recommendation:</h4>
                        <p className="text-sm">{decision.recommendation}</p>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

        {/* Vulnerabilities Section */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-warning" />
                  Vulnerabilities Identified
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  {result.vulnerabilities.length} vulnerabilities identified during this exercise
                </p>
              </div>
              <div className="flex gap-2">
                <Select value={severityFilter} onValueChange={setSeverityFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="All Severities" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Severities</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" className="gap-2" onClick={exportVulnerabilitiesToCSV}>
                  <Download className="h-4 w-4" />
                  Export CSV
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[250px]">Description</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead className="min-w-[200px]">Mitigation</TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredVulnerabilities.map((vuln) => (
                    <TableRow key={vuln.id}>
                      <TableCell className="font-medium">{vuln.description}</TableCell>
                      <TableCell>{getSeverityBadge(vuln.severity)}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{vuln.mitigation}</TableCell>
                      <TableCell className="text-sm">{vuln.owner}</TableCell>
                      <TableCell className="text-sm">{format(vuln.dueDate, 'dd MMM yyyy')}</TableCell>
                      <TableCell>{getStatusBadge(vuln.status)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Actions Arising Section */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-lg">Actions Arising</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  {result.actions.filter(a => a.status === 'completed').length} of {result.actions.length} actions completed
                </p>
              </div>
              <div className="flex items-center gap-3 min-w-[200px]">
                <Progress value={getActionProgress()} className="h-2" />
                <span className="text-sm font-medium">{getActionProgress()}%</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {result.actions.map((action) => (
                <div 
                  key={action.id}
                  className={cn(
                    "flex items-start gap-4 p-4 rounded-lg border",
                    action.status === 'completed' && "bg-success/5 border-success/20"
                  )}
                >
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-4">
                      <p className={cn(
                        "font-medium",
                        action.status === 'completed' && "line-through text-muted-foreground"
                      )}>
                        {action.description}
                      </p>
                      {getStatusBadge(action.status)}
                    </div>
                    <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-muted-foreground">
                      <span><strong>Owner:</strong> {action.owner}</span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        Due: {format(action.dueDate, 'dd MMM yyyy')}
                      </span>
                      {action.completionDate && (
                        <span className="text-success">
                          Completed: {format(action.completionDate, 'dd MMM yyyy')}
                        </span>
                      )}
                    </div>
                    {action.notes && (
                      <p className="text-sm text-muted-foreground mt-2 italic">
                        Note: {action.notes}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Comparison with Previous Section */}
        {result.comparisonWithPrevious && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Comparison with Previous Exercise</CardTitle>
              <p className="text-sm text-muted-foreground">
                Previous exercise run on {format(result.comparisonWithPrevious.previousDate, 'dd MMMM yyyy')}
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Improvements */}
                <div className="p-4 rounded-lg bg-success/5 border border-success/20">
                  <h4 className="font-medium text-success flex items-center gap-2 mb-3">
                    <TrendingUp className="h-4 w-4" />
                    Improvements
                  </h4>
                  <ul className="space-y-2">
                    {result.comparisonWithPrevious.improvements.map((improvement, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                        {improvement}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Deteriorations */}
                <div className="p-4 rounded-lg bg-destructive/5 border border-destructive/20">
                  <h4 className="font-medium text-destructive flex items-center gap-2 mb-3">
                    <TrendingDown className="h-4 w-4" />
                    Areas of Concern
                  </h4>
                  <ul className="space-y-2">
                    {result.comparisonWithPrevious.deteriorations.map((issue, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <XCircle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
                        {issue}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Capital Comparison */}
              <div className="mt-6">
                <h4 className="font-medium mb-3">Capital Impact Comparison</h4>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Capital</TableHead>
                      <TableHead className="text-right">Previous Change</TableHead>
                      <TableHead className="text-right">Current Change</TableHead>
                      <TableHead className="text-right">Improvement</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {result.comparisonWithPrevious.capitalComparison.map((comparison) => {
                      const improvement = comparison.previousChange - comparison.currentChange;
                      return (
                        <TableRow key={comparison.capitalName}>
                          <TableCell className="font-medium">{comparison.capitalName}</TableCell>
                          <TableCell className="text-right text-destructive">
                            {comparison.previousChange}
                          </TableCell>
                          <TableCell className="text-right text-destructive">
                            {comparison.currentChange}
                          </TableCell>
                          <TableCell className="text-right">
                            <span className={cn(
                              'flex items-center justify-end gap-1',
                              improvement > 0 ? 'text-success' : improvement < 0 ? 'text-destructive' : ''
                            )}>
                              {improvement > 0 ? (
                                <TrendingUp className="h-4 w-4" />
                              ) : improvement < 0 ? (
                                <TrendingDown className="h-4 w-4" />
                              ) : (
                                <Minus className="h-4 w-4" />
                              )}
                              {improvement > 0 ? '+' : ''}{improvement} pts better
                            </span>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t bg-card mt-8">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <p>© 2025 St. Mary's NHS Foundation Trust. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <Link to="/privacy" className="hover:text-foreground transition-colors">
                Privacy Policy
              </Link>
              <Link to="/accessibility" className="hover:text-foreground transition-colors">
                Accessibility
              </Link>
            </div>
          </div>
        </div>
      </footer>

      <DataSourcesModal isOpen={isDataSourcesOpen} onClose={() => setIsDataSourcesOpen(false)} />
    </div>
  );
};

export default ExerciseResults;
