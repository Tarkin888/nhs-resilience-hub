import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { 
  ChevronRight, 
  Search, 
  Filter, 
  Clock, 
  Users, 
  Monitor, 
  Zap, 
  PlayCircle,
  CheckCircle,
  Calendar
} from 'lucide-react';
import { motion } from 'framer-motion';
import DemoBanner from '@/components/DemoBanner';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { exercisePackages, getExerciseResultByExerciseId } from '@/lib/exercisesData';
import { cn } from '@/lib/utils';
import DataSourcesModal from '@/components/DataSourcesModal';
import ExercisePackageModal from '@/components/exercises/ExercisePackageModal';
import { ExercisePackage } from '@/types/exercises';

const ExerciseLibrary = () => {
  const [isMethodologyOpen, setIsMethodologyOpen] = useState(false);
  const [isDataSourcesOpen, setIsDataSourcesOpen] = useState(false);
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPackage, setSelectedPackage] = useState<ExercisePackage | null>(null);

  const filteredExercises = useMemo(() => {
    return exercisePackages.filter(pkg => {
      const matchesType = typeFilter === 'all' || pkg.exercise.type === typeFilter;
      const matchesCategory = categoryFilter === 'all' || pkg.exercise.scenarioCategory === categoryFilter;
      const matchesSearch = searchQuery === '' || 
        pkg.exercise.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pkg.exercise.scenarioName.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesType && matchesCategory && matchesSearch;
    });
  }, [typeFilter, categoryFilter, searchQuery]);

  const getTypeBadge = (type: 'desktop' | 'live' | 'simulation') => {
    const config = {
      desktop: { 
        label: 'Desktop', 
        className: 'bg-[#2196F3] text-white hover:bg-[#1976D2]',
        icon: Monitor
      },
      live: { 
        label: 'Live', 
        className: 'bg-[#4CAF50] text-white hover:bg-[#388E3C]',
        icon: Zap
      },
      simulation: { 
        label: 'Simulation', 
        className: 'bg-[#F44336] text-white hover:bg-[#D32F2F]',
        icon: PlayCircle
      }
    }[type];

    const Icon = config.icon;
    return (
      <Badge className={cn('font-medium gap-1', config.className)}>
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const getStatusBadge = (status: 'template' | 'scheduled' | 'completed') => {
    const config = {
      template: { label: 'Template', className: 'bg-muted text-muted-foreground' },
      scheduled: { label: 'Scheduled', className: 'bg-warning/20 text-warning-foreground border-warning' },
      completed: { label: 'Completed', className: 'bg-success/20 text-success border-success' }
    }[status];

    return (
      <Badge variant="outline" className={cn('font-medium', config.className)}>
        {config.label}
      </Badge>
    );
  };

  const getCategoryLabel = (category: string) => {
    return category.charAt(0).toUpperCase() + category.slice(1);
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
          <span className="text-foreground font-medium">Exercise Library</span>
        </nav>

        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              Exercise Library
            </h1>
            <p className="text-muted-foreground mt-1">
              Pre-built exercise packages for resilience testing and scenario planning
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
                <label className="text-sm font-medium text-muted-foreground">Exercise Type</label>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="desktop">Desktop</SelectItem>
                    <SelectItem value="live">Live</SelectItem>
                    <SelectItem value="simulation">Simulation</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-muted-foreground">Scenario Category</label>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="clinical">Clinical</SelectItem>
                    <SelectItem value="operational">Operational</SelectItem>
                    <SelectItem value="environmental">Environmental</SelectItem>
                    <SelectItem value="cyber">Cyber</SelectItem>
                    <SelectItem value="workforce">Workforce</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-1.5 flex-1 min-w-[200px]">
                <label className="text-sm font-medium text-muted-foreground">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search exercises..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>

              {(typeFilter !== 'all' || categoryFilter !== 'all' || searchQuery !== '') && (
                <div className="flex items-end">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => {
                      setTypeFilter('all');
                      setCategoryFilter('all');
                      setSearchQuery('');
                    }}
                  >
                    Clear Filters
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Exercise Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExercises.map((pkg, index) => {
            const hasResult = getExerciseResultByExerciseId(pkg.exercise.id);
            
            return (
              <motion.div
                key={pkg.exercise.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                whileHover={{ scale: 1.02 }}
                className="h-full"
              >
                <Card className="h-full flex flex-col shadow-card hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-lg leading-tight">
                        {pkg.exercise.name}
                      </CardTitle>
                      {getTypeBadge(pkg.exercise.type)}
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {getStatusBadge(pkg.exercise.status)}
                      <Badge variant="outline" className="text-xs">
                        {getCategoryLabel(pkg.exercise.scenarioCategory)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col">
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {pkg.exercise.scenarioName}
                    </p>
                    
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-4 w-4" />
                        <span>{pkg.exercise.duration}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Users className="h-4 w-4" />
                        <span>{pkg.exercise.participants.length} participants</span>
                      </div>
                    </div>

                    {pkg.exercise.lastRun && (
                      <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-4">
                        <Calendar className="h-4 w-4" />
                        <span>Last run: {format(pkg.exercise.lastRun, 'dd MMM yyyy')}</span>
                      </div>
                    )}

                    <div className="mt-auto pt-4 flex gap-2">
                      <Button 
                        className="flex-1 gap-2"
                        onClick={() => setSelectedPackage(pkg)}
                      >
                        View Package
                      </Button>
                      {hasResult && (
                        <Button 
                          variant="outline" 
                          size="icon"
                          asChild
                        >
                          <Link to={`/scenarios/results/${hasResult.id}`}>
                            <CheckCircle className="h-4 w-4 text-success" />
                          </Link>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {filteredExercises.length === 0 && (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground">No exercises match the selected filters.</p>
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
      
      <ExercisePackageModal 
        exercisePackage={selectedPackage} 
        onClose={() => setSelectedPackage(null)} 
      />
    </div>
  );
};

export default ExerciseLibrary;
