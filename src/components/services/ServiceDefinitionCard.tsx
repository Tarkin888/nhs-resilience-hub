import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Route, Scale, Users } from 'lucide-react';
import { DetailedEssentialService } from '@/types/services';

interface ServiceDefinitionCardProps {
  service: DetailedEssentialService;
}

const ServiceDefinitionCard = ({ service }: ServiceDefinitionCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          Service Definition
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Description */}
        <div>
          <h4 className="font-semibold text-foreground mb-2">Description</h4>
          <div className="text-muted-foreground whitespace-pre-line leading-relaxed">
            {service.description}
          </div>
        </div>

        {/* Critical Pathways */}
        <div>
          <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
            <Route className="h-4 w-4 text-primary" />
            Critical Patient Pathways
          </h4>
          <div className="flex flex-wrap gap-2">
            {service.criticalPathways.map((pathway, index) => (
              <Badge key={index} variant="secondary" className="font-normal">
                {pathway}
              </Badge>
            ))}
          </div>
        </div>

        {/* Regulatory Requirements */}
        <div>
          <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
            <Scale className="h-4 w-4 text-primary" />
            Regulatory Requirements
          </h4>
          <ul className="list-disc list-inside space-y-1 text-muted-foreground">
            {service.regulatoryRequirements.map((req, index) => (
              <li key={index}>{req}</li>
            ))}
          </ul>
        </div>

        {/* Community Impact */}
        <div>
          <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" />
            Community Impact Statement
          </h4>
          <p className="text-muted-foreground italic border-l-4 border-primary/30 pl-4">
            {service.communityImpact}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ServiceDefinitionCard;
