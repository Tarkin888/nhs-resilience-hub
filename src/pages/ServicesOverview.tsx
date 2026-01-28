import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { Eye, TestTube, Pencil, Filter, ChevronRight } from 'lucide-react';
import DemoBanner from '@/components/DemoBanner';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { detailedServices, getUniqueExecutives } from '@/lib/servicesData';
import { cn } from '@/lib/utils';
import DataSourcesModal from '@/components/DataSourcesModal';

const ServicesOverview = () => {
  const [isMethodologyOpen, setIsMethodologyOpen] = useState(false);
  const [isDataSourcesOpen, setIsDataSourcesOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [executiveFilter, setExecutiveFilter] = useState<string>('all');

  const executives = getUniqueExecutives();

  const filteredServices = useMemo(() => {
    return detailedServices.filter(service => {
      const matchesStatus = statusFilter === 'all' || service.status === statusFilter;
      const matchesExecutive = executiveFilter === 'all' || service.executiveOwner === executiveFilter;
      return matchesStatus && matchesExecutive;
    });
  }, [statusFilter, executiveFilter]);

  const getStatusBadge = (status: string) => {
    const config = {
      operational: { label: 'Operational', className: 'bg-success text-success-foreground' },
      degraded: { label: 'Degraded', className: 'bg-warning text-warning-foreground' },
      'at-risk': { label: 'At Risk', className: 'bg-destructive text-destructive-foreground' },
    }[status] || { label: status, className: '' };

    return (
      <Badge className={cn('font-medium', config.className)}>
        {config.label}
      </Badge>
    );
  };

  const getPerformanceVsThreshold = (service: typeof detailedServices[0]) => {
    const primaryMetric = service.metrics[0];
    if (!primaryMetric) return 'N/A';
    
    const statusColors = {
      green: 'text-success',
      amber: 'text-warning',
      red: 'text-destructive',
    };

    return (
      <span className={cn('font-medium', statusColors[primaryMetric.status])}>
        {primaryMetric.currentValue} / {primaryMetric.target}
      </span>
    );
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
          <span className="text-foreground font-medium">Essential Services Registry</span>
        </nav>

        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              Essential Services Registry
            </h1>
            <p className="text-muted-foreground mt-1">
              Operational resilience status for all critical NHS services
            </p>
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-muted-foreground">Status</label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="operational">Operational</SelectItem>
                    <SelectItem value="degraded">Degraded</SelectItem>
                    <SelectItem value="at-risk">At Risk</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-muted-foreground">Executive Owner</label>
                <Select value={executiveFilter} onValueChange={setExecutiveFilter}>
                  <SelectTrigger className="w-[220px]">
                    <SelectValue placeholder="All Executives" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Executives</SelectItem>
                    {executives.map(exec => (
                      <SelectItem key={exec} value={exec}>{exec}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {(statusFilter !== 'all' || executiveFilter !== 'all') && (
                <div className="flex items-end">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => {
                      setStatusFilter('all');
                      setExecutiveFilter('all');
                    }}
                  >
                    Clear Filters
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Services Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">Service Name</TableHead>
                  <TableHead className="w-[120px]">Status</TableHead>
                  <TableHead className="hidden md:table-cell">Impact Tolerance</TableHead>
                  <TableHead className="hidden lg:table-cell">Performance</TableHead>
                  <TableHead className="hidden lg:table-cell">Last Tested</TableHead>
                  <TableHead className="hidden md:table-cell">Executive Owner</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredServices.map((service) => (
                  <TableRow key={service.id} className="group hover:bg-muted/50 cursor-pointer">
                    <TableCell>
                      <Link 
                        to={`/services/${service.id}`}
                        className="font-medium text-foreground hover:text-primary transition-colors hover:underline block"
                      >
                        {service.name}
                      </Link>
                    </TableCell>
                    <TableCell>{getStatusBadge(service.status)}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      <span className="text-sm text-muted-foreground line-clamp-1">
                        {service.impactTolerances.fullService.definition.slice(0, 50)}...
                      </span>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {getPerformanceVsThreshold(service)}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <span className="text-sm">
                        {format(service.lastTested, 'dd MMM yyyy')}
                      </span>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <span className="text-sm">{service.executiveOwner}</span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                              <Link to={`/services/${service.id}`}>
                                <Eye className="h-4 w-4" />
                                <span className="sr-only">View details</span>
                              </Link>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>View Details</TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <TestTube className="h-4 w-4" />
                              <span className="sr-only">Schedule test</span>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Schedule Test</TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Pencil className="h-4 w-4" />
                              <span className="sr-only">Edit service</span>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Edit Service</TooltipContent>
                        </Tooltip>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {filteredServices.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                No services match the selected filters.
              </div>
            )}
          </CardContent>
        </Card>
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

export default ServicesOverview;
