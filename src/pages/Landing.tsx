import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Phone, PhoneCall, CheckCircle2, Clock, Zap, Shield, BarChart3, Calendar } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-sm bg-background/80 border-b">
        <div className="container mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-primary/10">
              <Phone className="h-6 w-6 text-primary" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              Ringlify
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Button onClick={() => navigate("/dashboard")} variant="ghost" className="hidden sm:inline-flex">
              Features
            </Button>
            <Button onClick={() => navigate("/dashboard")} variant="ghost" className="hidden sm:inline-flex">
              Pricing
            </Button>
            <Button onClick={() => navigate("/dashboard")} variant="default" size="sm">
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-6 pt-32 pb-20 text-center">
        <div className="mx-auto max-w-4xl space-y-8 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
            <Zap className="h-4 w-4" />
            <span>AI-Powered Phone Assistant</span>
          </div>
          
          <h1 className="text-6xl md:text-7xl font-bold tracking-tight leading-tight">
            Your AI assistant
            <br />
            <span className="bg-gradient-to-r from-primary via-blue-600 to-purple-600 bg-clip-text text-transparent">
              for phone calls
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Never miss a call again. Ringlify answers every call, books appointments, and provides perfect customer service 24/7.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button
              size="lg"
              onClick={() => navigate("/dashboard")}
              className="text-lg px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              <PhoneCall className="mr-2 h-5 w-5" />
              Start Free Trial
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="text-lg px-8 py-6 rounded-xl" 
              onClick={() => navigate("/dashboard")}
            >
              Watch Demo
            </Button>
          </div>

          <div className="flex items-center justify-center gap-8 pt-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span>14-day free trial</span>
            </div>
          </div>
        </div>

        {/* Hero Image/Demo */}
        <div className="mt-20 mx-auto max-w-5xl">
          <Card className="p-2 rounded-2xl shadow-2xl bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700">
            <div className="rounded-xl overflow-hidden bg-gradient-to-br from-blue-900/20 to-purple-900/20 backdrop-blur-sm aspect-video flex items-center justify-center">
              <div className="text-center space-y-4 p-8">
                <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-green-500/20 border border-green-500/30">
                  <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
                  <span className="text-green-400 font-medium">Live Call in Progress</span>
                </div>
                <div className="text-white/80 text-lg max-w-md mx-auto">
                  "Hi, I'd like to schedule an appointment for next Tuesday at 2 PM..."
                </div>
                <div className="flex items-center justify-center gap-4 pt-4">
                  <div className="h-1 w-32 bg-white/20 rounded-full overflow-hidden">
                    <div className="h-full w-3/4 bg-primary rounded-full animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
          {[
            { value: "99.9%", label: "Uptime" },
            { value: "<2s", label: "Response Time" },
            { value: "50K+", label: "Calls Handled" },
            { value: "24/7", label: "Availability" }
          ].map((stat, i) => (
            <div key={i} className="text-center space-y-2">
              <div className="text-4xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-6 py-20">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold">
            Everything you need to
            <br />
            <span className="text-primary">handle calls effortlessly</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Powerful features that make your phone system smarter than ever
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {[
            {
              icon: PhoneCall,
              title: "Smart Call Handling",
              description: "AI understands context and intent, providing natural conversations that feel human."
            },
            {
              icon: Calendar,
              title: "Appointment Booking",
              description: "Automatically schedule appointments with calendar integration and confirmations."
            },
            {
              icon: Clock,
              title: "24/7 Availability",
              description: "Never miss a call. Your AI receptionist works around the clock, every day."
            },
            {
              icon: BarChart3,
              title: "Real-time Analytics",
              description: "Track call metrics, sentiment analysis, and customer insights in real-time."
            },
            {
              icon: Zap,
              title: "Instant Responses",
              description: "Sub-second response times ensure customers never wait on hold."
            },
            {
              icon: Shield,
              title: "Enterprise Security",
              description: "Bank-level encryption and compliance with GDPR, HIPAA, and SOC 2."
            }
          ].map((feature, i) => (
            <Card 
              key={i} 
              className="p-6 rounded-2xl hover:shadow-lg transition-all hover:-translate-y-1 bg-gradient-to-br from-card to-card/50"
            >
              <div className="p-3 rounded-xl bg-primary/10 w-fit mb-4">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-6 py-20">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold">
            Get started in <span className="text-primary">3 simple steps</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {[
            { step: "1", title: "Connect Your Number", desc: "Link your existing phone number or get a new one" },
            { step: "2", title: "Customize Your AI", desc: "Train your AI on your business, services, and preferences" },
            { step: "3", title: "Start Receiving Calls", desc: "Your AI handles calls while you focus on your business" }
          ].map((item, i) => (
            <div key={i} className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary">
                {item.step}
              </div>
              <h3 className="text-xl font-semibold">{item.title}</h3>
              <p className="text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Social Proof */}
      <section className="bg-muted/30 py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Trusted by businesses worldwide</h2>
            <p className="text-muted-foreground">Join hundreds of companies that never miss a call</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { name: "Sarah Johnson", role: "Dental Practice Owner", quote: "Ringlify handles all our appointment scheduling. We've cut down missed calls by 95%." },
              { name: "Michael Chen", role: "Law Firm Partner", quote: "The AI understands legal terminology and routes calls perfectly. It's like having a dedicated receptionist." },
              { name: "Emily Rodriguez", role: "Restaurant Manager", quote: "Our reservation bookings have increased 40% since we started using Ringlify. Game changer!" }
            ].map((testimonial, i) => (
              <Card key={i} className="p-6 rounded-2xl">
                <div className="space-y-4">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-yellow-500">★</span>
                    ))}
                  </div>
                  <p className="text-muted-foreground italic">"{testimonial.quote}"</p>
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="container mx-auto px-6 py-20">
        <Card className="rounded-3xl p-12 text-center bg-gradient-to-br from-primary to-blue-600 text-white border-0">
          <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold">
              Never miss a call again
            </h2>
            <p className="text-xl opacity-90">
              Start your 14-day free trial today. No credit card required.
            </p>
            <div className="pt-4">
              <Button 
                size="lg" 
                onClick={() => navigate("/dashboard")}
                className="bg-white text-primary hover:bg-gray-100 text-lg px-8 py-6 rounded-xl shadow-lg"
              >
                Get Started Free
              </Button>
            </div>
          </div>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/30">
        <div className="container mx-auto px-6 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Phone className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold">Ringlify</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Your AI assistant for phone calls, available 24/7.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Enterprise</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">About</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Privacy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2025 Ringlify. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
