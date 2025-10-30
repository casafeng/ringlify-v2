import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Phone, Sparkles, Clock, Shield } from "lucide-react";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      {/* Header */}
      <header className="container mx-auto flex items-center justify-between px-6 py-6">
        <div className="flex items-center gap-2">
          <Phone className="h-8 w-8 text-primary" />
          <span className="text-2xl font-bold text-foreground">Ringlify</span>
        </div>
        <Button onClick={() => navigate("/dashboard")} variant="default">
          Sign In
        </Button>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20 text-center">
        <div className="mx-auto max-w-3xl space-y-6">
          <h1 className="text-5xl font-bold tracking-tight text-foreground sm:text-6xl">
            Your AI Receptionist, <span className="text-primary">Always On</span>
          </h1>
          <p className="text-xl text-muted-foreground">
            Never miss a call again. Ringlify's AI handles your phone calls 24/7, schedules appointments, and answers customer questions instantly.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button
              size="lg"
              onClick={() => navigate("/dashboard")}
              className="text-lg"
            >
              Get Started Free
            </Button>
            <Button size="lg" variant="outline" className="text-lg" onClick={() => navigate("/dashboard")}>
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-3 rounded-lg border bg-card p-6">
            <Phone className="h-10 w-10 text-primary" />
            <h3 className="text-xl font-semibold text-card-foreground">24/7 Availability</h3>
            <p className="text-muted-foreground">
              Your AI receptionist never sleeps. Handle calls anytime, day or night.
            </p>
          </div>
          <div className="space-y-3 rounded-lg border bg-card p-6">
            <Sparkles className="h-10 w-10 text-primary" />
            <h3 className="text-xl font-semibold text-card-foreground">Smart Conversations</h3>
            <p className="text-muted-foreground">
              Natural AI conversations that understand context and intent.
            </p>
          </div>
          <div className="space-y-3 rounded-lg border bg-card p-6">
            <Clock className="h-10 w-10 text-primary" />
            <h3 className="text-xl font-semibold text-card-foreground">Instant Scheduling</h3>
            <p className="text-muted-foreground">
              Book appointments automatically with real-time calendar integration.
            </p>
          </div>
          <div className="space-y-3 rounded-lg border bg-card p-6">
            <Shield className="h-10 w-10 text-primary" />
            <h3 className="text-xl font-semibold text-card-foreground">Enterprise Security</h3>
            <p className="text-muted-foreground">
              Your data is encrypted and protected with enterprise-grade security.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t bg-card">
        <div className="container mx-auto px-6 py-16 text-center">
          <h2 className="mb-4 text-3xl font-bold text-card-foreground">
            Ready to transform your customer service?
          </h2>
          <p className="mb-8 text-lg text-muted-foreground">
            Join hundreds of businesses using Ringlify to never miss a call.
          </p>
          <Button size="lg" onClick={() => navigate("/dashboard")}>
            Start Your Free Trial
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t">
        <div className="container mx-auto px-6 py-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2025 Ringlify. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
