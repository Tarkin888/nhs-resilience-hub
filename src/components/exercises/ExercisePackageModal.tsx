import { useState } from 'react';
import { format } from 'date-fns';
import { 
  X, 
  Download, 
  Clock, 
  Users, 
  Target, 
  FileText, 
  CheckSquare, 
  MessageSquare,
  ChevronRight,
  Calendar,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ExercisePackage } from '@/types/exercises';
import { cn } from '@/lib/utils';
import { generateExercisePDF } from '@/lib/exercisePdfGenerator';
import { toast } from 'sonner';
import ScheduleExerciseModal from './ScheduleExerciseModal';

interface ExercisePackageModalProps {
  exercisePackage: ExercisePackage | null;
  onClose: () => void;
}

const ExercisePackageModal = ({ exercisePackage, onClose }: ExercisePackageModalProps) => {
  const [activeTab, setActiveTab] = useState('plan');
  const [isDownloading, setIsDownloading] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);

  if (!exercisePackage) return null;

  const { exercise, injects, evaluationCriteria, debriefQuestions } = exercisePackage;

  const handleDownloadPDF = async () => {
    setIsDownloading(true);
    try {
      await generateExercisePDF(exercisePackage);
      toast.success('PDF downloaded successfully');
    } catch (error) {
      console.error('PDF generation error:', error);
      toast.error('Failed to generate PDF');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleScheduleSuccess = () => {
    setIsScheduleModalOpen(false);
  };


  const getTypeBadge = (type: 'desktop' | 'live' | 'simulation') => {
    const config = {
      desktop: { label: 'Desktop', className: 'bg-[#2196F3] text-white' },
      live: { label: 'Live', className: 'bg-[#4CAF50] text-white' },
      simulation: { label: 'Simulation', className: 'bg-[#F44336] text-white' }
    }[type];

    return (
      <Badge className={cn('font-medium', config.className)}>
        {config.label}
      </Badge>
    );
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="bg-background rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-start justify-between p-6 border-b">
            <div className="flex-1 pr-4">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-xl font-bold text-foreground">{exercise.name}</h2>
                {getTypeBadge(exercise.type)}
              </div>
              <p className="text-muted-foreground">{exercise.scenarioName}</p>
              
              <div className="flex flex-wrap gap-4 mt-4 text-sm">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{exercise.duration}</span>
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>{exercise.participants.length} participants</span>
                </div>
                {exercise.lastRun && (
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <span>Last run: {format(exercise.lastRun, 'dd MMM yyyy')}</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                className="gap-2"
                onClick={() => setIsScheduleModalOpen(true)}
              >
                <Calendar className="h-4 w-4" />
                <span className="hidden sm:inline">Schedule</span>
              </Button>
              <Button 
                variant="outline" 
                className="gap-2"
                onClick={handleDownloadPDF}
                disabled={isDownloading}
              >
                {isDownloading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Download className="h-4 w-4" />
                )}
                <span className="hidden sm:inline">Download PDF</span>
              </Button>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Tabs Content */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0">
            <div className="border-b px-6">
              <TabsList className="h-12 bg-transparent p-0 gap-4">
                <TabsTrigger 
                  value="plan" 
                  className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 pb-3"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Exercise Plan
                </TabsTrigger>
                <TabsTrigger 
                  value="injects"
                  className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 pb-3"
                >
                  <ChevronRight className="h-4 w-4 mr-2" />
                  Scenario Injects
                </TabsTrigger>
                <TabsTrigger 
                  value="evaluation"
                  className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 pb-3"
                >
                  <CheckSquare className="h-4 w-4 mr-2" />
                  Evaluation
                </TabsTrigger>
                <TabsTrigger 
                  value="debrief"
                  className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 pb-3"
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Debrief
                </TabsTrigger>
              </TabsList>
            </div>

            <ScrollArea className="flex-1">
              <div className="p-6">
                <TabsContent value="plan" className="mt-0 space-y-6">
                  {/* Objectives */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Target className="h-4 w-4" />
                        Objectives
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {exercise.objectives.map((objective, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm">
                            <span className="text-primary font-medium">{idx + 1}.</span>
                            <span>{objective}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  {/* Participants */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Participants
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {exercise.participants.map((participant, idx) => (
                          <Badge key={idx} variant="secondary">
                            {participant}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Facilitator */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">Facilitator Responsibilities</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-3">
                        <strong>Lead Facilitator:</strong> {exercise.facilitator}
                      </p>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>• Brief all participants before exercise start</li>
                        <li>• Deliver injects at specified times</li>
                        <li>• Observe and note decisions made</li>
                        <li>• Manage exercise pace and time</li>
                        <li>• Lead debrief session</li>
                      </ul>
                    </CardContent>
                  </Card>

                  {/* Materials Required */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">Materials Required</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-1">
                        {exercise.materialsRequired.map((material, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-sm">
                            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                            {material}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="injects" className="mt-0">
                  <div className="relative">
                    {/* Timeline line */}
                    <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />
                    
                    <div className="space-y-6">
                      {injects.map((inject, idx) => (
                        <div key={inject.id} className="relative pl-12">
                          {/* Timeline dot */}
                          <div className="absolute left-2.5 top-1 h-4 w-4 rounded-full bg-primary border-4 border-background" />
                          
                          <Card>
                            <CardHeader className="pb-3">
                              <Badge variant="outline" className="w-fit mb-2 font-mono">
                                {inject.timeMarker}
                              </Badge>
                              <p className="text-sm">{inject.description}</p>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              <div>
                                <h4 className="text-sm font-medium mb-2">Facilitator Prompts:</h4>
                                <ul className="space-y-1">
                                  {inject.facilitatorPrompts.map((prompt, pIdx) => (
                                    <li key={pIdx} className="text-sm italic text-muted-foreground">
                                      "{prompt}"
                                    </li>
                                  ))}
                                </ul>
                              </div>
                              
                              {inject.expectedResponses && inject.expectedResponses.length > 0 && (
                                <div>
                                  <h4 className="text-sm font-medium mb-2">Expected Responses:</h4>
                                  <ul className="space-y-1">
                                    {inject.expectedResponses.map((response, rIdx) => (
                                      <li key={rIdx} className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <span className="h-1.5 w-1.5 rounded-full bg-success" />
                                        {response}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="evaluation" className="mt-0">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Evaluation Criteria Checklist</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Use this checklist during and after the exercise to evaluate performance.
                      </p>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {evaluationCriteria.map((criterion, idx) => (
                          <div 
                            key={criterion.id} 
                            className="flex items-start gap-4 p-4 rounded-lg border bg-muted/30"
                          >
                            <span className="flex-shrink-0 h-6 w-6 rounded-full bg-primary/10 text-primary text-sm font-medium flex items-center justify-center">
                              {idx + 1}
                            </span>
                            <div className="flex-1">
                              <p className="text-sm font-medium">{criterion.criterion}</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                Target: {criterion.targetOutcome}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <Badge variant="outline" className="cursor-pointer hover:bg-success/20 hover:border-success">
                                YES
                              </Badge>
                              <Badge variant="outline" className="cursor-pointer hover:bg-warning/20 hover:border-warning">
                                PARTIAL
                              </Badge>
                              <Badge variant="outline" className="cursor-pointer hover:bg-destructive/20 hover:border-destructive">
                                NO
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="debrief" className="mt-0">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Debrief Discussion Template</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Use these structured questions to guide the post-exercise debrief session.
                      </p>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {debriefQuestions.map((question, idx) => (
                          <div key={idx} className="space-y-2">
                            <div className="flex items-start gap-3">
                              <span className="flex-shrink-0 h-6 w-6 rounded-full bg-primary text-primary-foreground text-sm font-medium flex items-center justify-center">
                                {idx + 1}
                              </span>
                              <p className="text-sm font-medium pt-0.5">{question}</p>
                            </div>
                            <div className="ml-9 p-3 rounded-lg border border-dashed bg-muted/20 min-h-[60px]">
                              <p className="text-xs text-muted-foreground italic">Notes space...</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </div>
            </ScrollArea>
          </Tabs>
        </motion.div>
      </motion.div>

      {/* Schedule Modal */}
      {isScheduleModalOpen && (
        <ScheduleExerciseModal
          exercisePackage={exercisePackage}
          onClose={() => setIsScheduleModalOpen(false)}
          onScheduled={handleScheduleSuccess}
        />
      )}
    </AnimatePresence>
  );
};

export default ExercisePackageModal;
