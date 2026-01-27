import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const PrivacyPolicy = () => {
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
          <h1 className="text-2xl md:text-3xl font-bold">Privacy Policy</h1>
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
            <h2 className="text-xl font-semibold text-foreground mb-4">About this policy</h2>
            <p className="text-foreground/80 leading-relaxed">
              This privacy policy explains how St. Mary's NHS Foundation Trust collects, uses, and protects 
              information within the Resilience Command Centre dashboard. This is a demonstration application 
              for illustrative purposes.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">Information we collect</h2>
            <p className="text-foreground/80 leading-relaxed mb-4">
              In accordance with NHS data protection standards, we may collect and process:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-foreground/80">
              <li>Aggregated operational data from trust systems</li>
              <li>Anonymous usage analytics for dashboard improvement</li>
              <li>Session data necessary for system functionality</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">How we use your information</h2>
            <p className="text-foreground/80 leading-relaxed mb-4">
              Information is used to:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-foreground/80">
              <li>Provide real-time resilience monitoring and alerts</li>
              <li>Generate scenario impact assessments</li>
              <li>Improve dashboard functionality and user experience</li>
              <li>Ensure system security and compliance</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">Data protection</h2>
            <p className="text-foreground/80 leading-relaxed">
              We adhere to the UK General Data Protection Regulation (UK GDPR), the Data Protection Act 2018, 
              and NHS England's Data Security and Protection Toolkit requirements. All data is processed in 
              accordance with the Caldicott Principles.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">Your rights</h2>
            <p className="text-foreground/80 leading-relaxed mb-4">
              Under data protection law, you have rights including:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-foreground/80">
              <li>The right to access your personal data</li>
              <li>The right to rectification of inaccurate data</li>
              <li>The right to erasure in certain circumstances</li>
              <li>The right to restrict processing</li>
              <li>The right to data portability</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">Contact us</h2>
            <p className="text-foreground/80 leading-relaxed">
              For privacy-related enquiries, please contact the Trust's Data Protection Officer at{' '}
              <a 
                href="mailto:dpo@stmarys-nhs.example.uk" 
                className="text-primary hover:underline"
              >
                dpo@stmarys-nhs.example.uk
              </a>
            </p>
          </section>

          <div className="border-t pt-6 mt-8">
            <p className="text-sm text-muted-foreground italic">
              Note: This is a demonstration application. All data shown is illustrative and does not 
              represent real patient, staff, or operational information.
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

export default PrivacyPolicy;
