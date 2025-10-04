import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Brain, Database, MessageSquare, TrendingUp, Users, Zap } from "lucide-react";

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">IntelliQuery</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link to="/signup">
              <Button className="bg-gradient-primary shadow-glow">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20 text-center">
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
          <h1 className="text-6xl font-bold leading-tight">
            Query Your MongoDB Data
            <span className="block bg-gradient-primary bg-clip-text text-transparent">
              In Plain English
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            IntelliQuery transforms natural language into powerful MongoDB queries. 
            Get instant insights with AI-powered analysis, beautiful visualizations, and zero SQL knowledge required.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link to="/signup">
              <Button size="lg" className="bg-gradient-primary shadow-glow text-lg px-8">
                Start Free Trial
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="text-lg px-8">
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-6 py-20">
        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard
            icon={<MessageSquare className="h-8 w-8" />}
            title="Natural Language Queries"
            description="Ask questions in plain English. Our AI understands your intent and generates optimized MongoDB queries."
          />
          <FeatureCard
            icon={<TrendingUp className="h-8 w-8" />}
            title="Smart Visualizations"
            description="Automatically generates charts and tables from your data. Interactive, beautiful, and insightful."
          />
          <FeatureCard
            icon={<Database className="h-8 w-8" />}
            title="Schema Auto-Discovery"
            description="Upload your schema once. We learn your data structure and provide intelligent suggestions."
          />
          <FeatureCard
            icon={<Zap className="h-8 w-8" />}
            title="Lightning Fast"
            description="Optimized queries with automatic retry and repair. Get results in milliseconds, not minutes."
          />
          <FeatureCard
            icon={<Users className="h-8 w-8" />}
            title="Team Collaboration"
            description="Multi-tenant architecture. Invite your team, share queries, and collaborate on data analysis."
          />
          <FeatureCard
            icon={<Brain className="h-8 w-8" />}
            title="AI-Powered Insights"
            description="Get executive summaries and key observations. Our AI analyst works 24/7 for you."
          />
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-6 py-20 text-center">
        <div className="bg-card rounded-2xl p-12 shadow-card border border-border max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold mb-4">Ready to Transform Your Data Analysis?</h2>
          <p className="text-muted-foreground mb-8 text-lg">
            Join hundreds of teams already using IntelliQuery to unlock insights from their MongoDB data.
          </p>
          <Link to="/signup">
            <Button size="lg" className="bg-gradient-primary shadow-glow text-lg px-10">
              Get Started Free
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-6 text-center text-muted-foreground">
          <p>&copy; 2025 IntelliQuery. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) => {
  return (
    <div className="bg-card p-6 rounded-xl border border-border hover:border-primary transition-all duration-300 hover:shadow-glow">
      <div className="text-primary mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
};

export default Landing;
