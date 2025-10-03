import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MessageCircle, Scale, Shield, Users } from "lucide-react";

interface LandingPageProps {
  onStartChat: () => void;
}

const LandingPage = ({ onStartChat }: LandingPageProps) => {
  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-soft">
            <Scale className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">UAE Labor Rights</h2>
            <p className="text-primary-foreground/80 text-sm">AI Legal Assistant</p>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight mb-6">
              Know Your Rights as a
              <span className="block text-primary-glow">UAE Employee</span>
            </h1>
            <p className="text-xl md:text-2xl text-primary-foreground/90 mb-8 max-w-3xl mx-auto">
              Chat with AI lawyers trained on UAE labor laws from MOHRE. 
              Get instant answers about contracts, wages, working hours, and termination rights.
            </p>
          </div>

          <div className="mb-12">
            <Button 
              onClick={onStartChat}
              size="lg"
              variant="secondary"
              className="bg-white text-primary hover:bg-primary-foreground/90 text-lg px-8 py-6 h-auto shadow-medium btn-hover-lift"
            >
              <MessageCircle className="w-6 h-6 mr-3" />
              Start Chat with AI Lawyer
            </Button>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <Card className="p-6 bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/15 transition-all duration-300">
              <MessageCircle className="w-12 h-12 text-primary-glow mb-4 mx-auto" />
              <h3 className="text-xl font-semibold mb-2">Text & Audio Chat</h3>
              <p className="text-primary-foreground/80">
                Communicate through text or voice in English and Arabic
              </p>
            </Card>

            <Card className="p-6 bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/15 transition-all duration-300">
              <Shield className="w-12 h-12 text-primary-glow mb-4 mx-auto" />
              <h3 className="text-xl font-semibold mb-2">MOHRE-Based Data</h3>
              <p className="text-primary-foreground/80">
                Information sourced from official UAE labor laws and regulations
              </p>
            </Card>

            <Card className="p-6 bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/15 transition-all duration-300">
              <Users className="w-12 h-12 text-primary-glow mb-4 mx-auto" />
              <h3 className="text-xl font-semibold mb-2">For All Employees</h3>
              <p className="text-primary-foreground/80">
                Accessible information for every UAE worker, regardless of background
              </p>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 text-center">
        <div className="max-w-2xl mx-auto">
          <p className="text-primary-foreground/70 mb-4">
            This service is based on UAE labor laws from the Ministry of Human Resources and Emiratisation (MOHRE).
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <a href="https://mohre.gov.ae" target="_blank" rel="noopener noreferrer" 
               className="text-primary-foreground/80 hover:text-white transition-colors">
              MOHRE Official Website
            </a>
            <span className="text-primary-foreground/60">•</span>
            <a href="#" className="text-primary-foreground/80 hover:text-white transition-colors">
              Privacy Policy
            </a>
            <span className="text-primary-foreground/60">•</span>
            <a href="#" className="text-primary-foreground/80 hover:text-white transition-colors">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;