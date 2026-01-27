import { Link } from 'react-router-dom';
import { ArrowLeft, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Accessibility = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground py-6">
        <div className="max-w-[900px] mx-auto px-4 md:px-8">
          <Link to="/">
            <Button variant="ghost" className="text-primary-foreground hover:bg-white/10 gap-2 mb-4">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold">Accessibility Statement</h1>
          <p className="text-primary-foreground/80 mt-2">
            St. Mary's NHS Foundation Trust
          </p>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-[900px] mx-auto px-4 md:px-8 py-8">
        <div className="prose prose-slate max-w-none">
          <p className="text-muted-foreground text-sm mb-6">
            Last updated: January 2025
          </p>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">Our commitment</h2>
            <p className="text-foreground/80 leading-relaxed">
              St. Mary's NHS Foundation Trust is committed to making the Resilience Command Centre 
              dashboard accessible to all users. We aim to meet the Web Content Accessibility Guidelines 
              (WCAG) 2.1 Level AA standards.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">Accessibility features</h2>
            <p className="text-foreground/80 leading-relaxed mb-4">
              This dashboard includes the following accessibility features:
            </p>
            <ul className="space-y-3">
              {[
                'Semantic HTML structure for screen reader compatibility',
                'Keyboard navigation support throughout the interface',
                'Colour contrast ratios meeting WCAG 2.1 AA standards (4.5:1 minimum)',
                'Focus indicators for interactive elements',
                'Alternative text for informational images',
                'Responsive design adapting to different screen sizes',
                'ARIA labels for dynamic content and status updates',
              ].map((feature, index) => (
                <li key={index} className="flex items-start gap-3 text-foreground/80">
                  <Check className="h-5 w-5 text-[hsl(var(--status-green))] flex-shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">Known limitations</h2>
            <p className="text-foreground/80 leading-relaxed mb-4">
              We are aware of the following accessibility limitations and are working to address them:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-foreground/80">
              <li>Some complex data visualisations may require additional context for screen reader users</li>
              <li>Animated scenario transitions may not respect reduced motion preferences in all cases</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">Browser compatibility</h2>
            <p className="text-foreground/80 leading-relaxed">
              This dashboard is optimised for use with modern browsers including Chrome, Firefox, Safari, 
              and Edge. We recommend keeping your browser updated to the latest version for the best 
              accessibility experience.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">Assistive technology</h2>
            <p className="text-foreground/80 leading-relaxed">
              This dashboard has been tested with common assistive technologies including JAWS, NVDA, 
              and VoiceOver. If you experience any difficulties using assistive technology with this 
              dashboard, please contact us.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">Feedback and contact</h2>
            <p className="text-foreground/80 leading-relaxed">
              We welcome your feedback on the accessibility of this dashboard. Please contact us at{' '}
              <a 
                href="mailto:accessibility@stmarys-nhs.example.uk" 
                className="text-primary hover:underline"
              >
                accessibility@stmarys-nhs.example.uk
              </a>
              {' '}if you encounter any accessibility barriers or have suggestions for improvement.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">Enforcement procedure</h2>
            <p className="text-foreground/80 leading-relaxed">
              The Equality and Human Rights Commission (EHRC) is responsible for enforcing the Public 
              Sector Bodies (Websites and Mobile Applications) (No. 2) Accessibility Regulations 2018. 
              If you're not happy with how we respond to your complaint, you can contact the{' '}
              <a 
                href="https://www.equalityadvisoryservice.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Equality Advisory and Support Service (EASS)
              </a>.
            </p>
          </section>

          <div className="border-t pt-6 mt-8">
            <p className="text-sm text-muted-foreground italic">
              Note: This is a demonstration application. This accessibility statement is illustrative 
              and for demonstration purposes only.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-card mt-8">
        <div className="max-w-[900px] mx-auto px-4 md:px-8 py-6">
          <p className="text-sm text-muted-foreground text-center">
            © 2025 St. Mary's NHS Foundation Trust. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Accessibility;
