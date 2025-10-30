import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Phone, PhoneCall, CheckCircle2, Clock, Zap, Shield, BarChart3, Calendar, Share2, Mail, User, MessageSquare, CreditCard } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useEffect, useRef, useState } from "react";

export default function Landing() {
  const navigate = useNavigate();
  const phoneRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!phoneRef.current) return;
      
      const rect = phoneRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const elementTop = rect.top;
      
      // Calculate progress from when element enters viewport (bottom) to when it leaves (top)
      const progress = Math.max(0, Math.min(1, 1 - (elementTop / windowHeight)));
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial check
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
      <section className="container mx-auto px-6 pt-32 pb-20 text-center relative overflow-hidden">
        {/* Floating decorative elements */}
        <div className="absolute top-20 left-10 w-24 h-24 opacity-20 animate-float">
          <div className="w-full h-full rounded-2xl bg-gradient-to-br from-blue-400 to-blue-600 shadow-2xl"></div>
        </div>
        <div className="absolute top-40 right-20 w-20 h-20 opacity-20 animate-float" style={{ animationDelay: "1s" }}>
          <div className="w-full h-full rounded-full bg-gradient-to-br from-purple-400 to-purple-600 shadow-2xl"></div>
        </div>

        <div className="mx-auto max-w-4xl space-y-8 animate-fade-in relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20">
            <Zap className="h-4 w-4" />
            <span>AI-Powered Phone Assistant</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-bold tracking-tight leading-tight">
            #1 AI assistant
            <br />
            <span className="bg-gradient-to-r from-primary via-blue-600 to-purple-600 bg-clip-text text-transparent">
              for phone calls
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Answer every call, book appointments automatically, and provide perfect customer service 24/7.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button
              size="lg"
              onClick={() => navigate("/dashboard")}
              className="text-lg px-8 py-6 rounded-xl shadow-lg hover:shadow-2xl transition-all hover:-translate-y-0.5"
            >
              <PhoneCall className="mr-2 h-5 w-5" />
              Start Free Trial
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="text-lg px-8 py-6 rounded-xl hover:shadow-lg transition-all" 
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

        {/* Hero Demo */}
        <div className="mt-24 mx-auto max-w-6xl relative">
          <div className="absolute -top-10 -left-10 w-32 h-32 rounded-3xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 blur-3xl"></div>
          <div className="absolute -bottom-10 -right-10 w-32 h-32 rounded-3xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 blur-3xl"></div>
          
          <Card className="p-3 rounded-3xl shadow-2xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 border-2 relative">
            <div className="rounded-2xl overflow-hidden bg-background/95 backdrop-blur-sm">
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/20 border border-green-500/30">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-green-600 dark:text-green-400 text-sm font-medium">Call in Progress</span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                      J
                    </div>
                    <div className="flex-1">
                      <div className="bg-white dark:bg-gray-800 rounded-2xl rounded-tl-none p-4 shadow-sm">
                        <p className="text-sm">"Hi, I'd like to schedule a haircut appointment for next Tuesday around 2 PM if that's available."</p>
                      </div>
                      <span className="text-xs text-muted-foreground ml-2 mt-1">John Smith • Just now</span>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 justify-end">
                    <div className="flex-1 flex justify-end">
                      <div className="max-w-md">
                        <div className="bg-gradient-to-br from-primary to-blue-600 rounded-2xl rounded-tr-none p-4 shadow-sm text-white">
                          <p className="text-sm">"Perfect! I can book you for Tuesday, January 14th at 2:00 PM with Sarah. I'll send you a confirmation text and email. Is there anything specific you'd like done?"</p>
                        </div>
                        <span className="text-xs text-muted-foreground mr-2 mt-1 flex justify-end">AI Assistant • Now</span>
                      </div>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-white">
                      <Phone className="h-5 w-5" />
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-muted-foreground justify-center pt-2">
                    <div className="flex items-center gap-1">
                      <div className="w-1 h-4 bg-primary rounded-full animate-pulse"></div>
                      <div className="w-1 h-6 bg-primary/70 rounded-full animate-pulse" style={{ animationDelay: "0.1s" }}></div>
                      <div className="w-1 h-5 bg-primary/50 rounded-full animate-pulse" style={{ animationDelay: "0.2s" }}></div>
                      <div className="w-1 h-7 bg-primary rounded-full animate-pulse" style={{ animationDelay: "0.3s" }}></div>
                    </div>
                    <span>AI listening...</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Scroll Animation - Phone Calling */}
      <section ref={phoneRef} className="container mx-auto px-6 py-32 relative overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-6">
              <Badge className="bg-primary/10 text-primary border-primary/20">
                Watch it in action
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold">
                Answer calls
                <br />
                <span className="text-primary">instantly</span>
              </h2>
              <p className="text-xl text-muted-foreground">
                Your AI receptionist picks up every call in under a second, 
                understands the caller's needs, and handles everything from 
                bookings to customer questions.
              </p>
              <div className="space-y-3">
                {[
                  "Natural conversation flow",
                  "Instant appointment booking",
                  "Real-time calendar integration",
                  "Multi-language support"
                ].map((item, i) => (
                  <div 
                    key={i} 
                    className="flex items-center gap-3"
                    style={{
                      opacity: scrollProgress > (i * 0.15) ? 1 : 0,
                      transform: scrollProgress > (i * 0.15) ? 'translateX(0)' : 'translateX(-20px)',
                      transition: 'all 0.5s ease-out'
                    }}
                  >
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                    <span className="text-lg">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Phone Mockup with Animation */}
            <div className="relative flex justify-center items-center min-h-[600px]">
              {/* Animated Phone */}
              <div 
                className="relative"
                style={{
                  transform: `scale(${0.8 + (scrollProgress * 0.2)}) translateY(${20 - (scrollProgress * 20)}px)`,
                  opacity: Math.max(0.3, scrollProgress),
                  transition: 'transform 0.3s ease-out, opacity 0.3s ease-out'
                }}
              >
                {/* Phone Frame */}
                <div className="w-[320px] h-[640px] bg-gradient-to-br from-gray-900 to-gray-800 rounded-[3rem] p-3 shadow-2xl border-8 border-gray-800 relative">
                  {/* Notch */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-gray-900 rounded-b-3xl z-10"></div>
                  
                  {/* Screen */}
                  <div className="w-full h-full bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 rounded-[2.5rem] overflow-hidden relative">
                    {/* Status Bar */}
                    <div className="absolute top-0 left-0 right-0 pt-8 px-8 flex justify-between text-xs font-medium text-gray-900 dark:text-white z-20">
                      <span>9:41</span>
                      <div className="flex gap-1">
                        <div className="w-4 h-4">📶</div>
                        <div className="w-4 h-4">📶</div>
                      </div>
                    </div>

                    {/* Calling Interface */}
                    <div className="absolute inset-0 flex flex-col items-center justify-between py-20 px-8">
                      {/* Caller Info */}
                      <div 
                        className="text-center space-y-4"
                        style={{
                          opacity: scrollProgress > 0.3 ? 1 : 0,
                          transform: scrollProgress > 0.3 ? 'translateY(0)' : 'translateY(-20px)',
                          transition: 'all 0.5s ease-out'
                        }}
                      >
                        <div className="relative mx-auto">
                          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center shadow-lg">
                            <Phone className="h-12 w-12 text-white" />
                          </div>
                          {/* Pulsing rings */}
                          <div 
                            className="absolute inset-0 rounded-full border-4 border-primary animate-ping"
                            style={{
                              opacity: scrollProgress > 0.5 ? 0.5 : 0
                            }}
                          ></div>
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Ringlify AI
                          </h3>
                          <p className="text-lg text-gray-600 dark:text-gray-400">
                            Incoming Call...
                          </p>
                        </div>
                        <div 
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/20 border border-green-500/30"
                          style={{
                            opacity: scrollProgress > 0.6 ? 1 : 0,
                            transition: 'opacity 0.5s ease-out'
                          }}
                        >
                          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                          <span className="text-green-600 dark:text-green-400 text-sm font-medium">
                            Connecting...
                          </span>
                        </div>
                      </div>

                      {/* Audio Waveform */}
                      <div 
                        className="flex items-center justify-center gap-1 h-16"
                        style={{
                          opacity: scrollProgress > 0.7 ? 1 : 0,
                          transition: 'opacity 0.5s ease-out'
                        }}
                      >
                        {[...Array(20)].map((_, i) => (
                          <div
                            key={i}
                            className="w-1 bg-primary rounded-full"
                            style={{
                              height: `${20 + Math.sin((scrollProgress * 10 + i) * 0.5) * 30}px`,
                              opacity: 0.3 + (Math.sin((scrollProgress * 10 + i) * 0.5) * 0.7),
                              transition: 'all 0.1s ease-out'
                            }}
                          ></div>
                        ))}
                      </div>

                      {/* Call Actions */}
                      <div 
                        className="flex gap-8"
                        style={{
                          opacity: scrollProgress > 0.5 ? 1 : 0,
                          transform: scrollProgress > 0.5 ? 'translateY(0)' : 'translateY(20px)',
                          transition: 'all 0.5s ease-out'
                        }}
                      >
                        <button className="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                          <PhoneCall className="h-8 w-8 text-white rotate-[135deg]" />
                        </button>
                        <button className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                          <PhoneCall className="h-8 w-8 text-white" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Glow Effect */}
                <div 
                  className="absolute inset-0 -z-10 bg-primary/20 blur-3xl rounded-full"
                  style={{
                    opacity: scrollProgress * 0.5,
                    transform: `scale(${1 + scrollProgress * 0.5})`,
                    transition: 'all 0.3s ease-out'
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* After Every Call Section */}
      <section className="container mx-auto px-6 py-32">
        <div className="text-center mb-12">
          <p className="text-primary font-medium mb-4">After every call...</p>
          <h2 className="text-5xl md:text-6xl font-bold mb-4">
            Beautiful summaries
            <br />
            <span className="text-muted-foreground">of every conversation</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Ringlify generates detailed call summaries with transcripts, sentiment analysis, and action items automatically.
          </p>
        </div>

        <div className="max-w-4xl mx-auto mt-16">
          <Card className="rounded-3xl overflow-hidden shadow-2xl border-2">
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-8">
              <div className="bg-background rounded-2xl p-6 shadow-lg">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Thu, Jan 9</span>
                    </div>
                    <h3 className="text-xl font-semibold">Appointment Booking Call</h3>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                    <Button variant="outline" size="sm">
                      <Mail className="h-4 w-4 mr-2" />
                      Email
                    </Button>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Caller Information
                    </h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Name</p>
                        <p className="font-medium">John Smith</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Phone</p>
                        <p className="font-medium">+1 (555) 123-4567</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Email</p>
                        <p className="font-medium">john.smith@email.com</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Sentiment</p>
                        <Badge className="bg-green-500/10 text-green-700 dark:text-green-400">Positive</Badge>
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-6">
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4" />
                      Action Items
                    </h4>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2"></div>
                        <span>Booked haircut appointment for Tuesday, January 14th at 2:00 PM</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2"></div>
                        <span>Assigned to Sarah (senior stylist)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2"></div>
                        <span>Sent confirmation via text and email</span>
                      </li>
                    </ul>
                  </div>

                  <div className="border-t pt-6">
                    <h4 className="font-semibold mb-3">Call Transcript</h4>
                    <div className="space-y-3 text-sm">
                      <div className="flex gap-2">
                        <span className="font-medium min-w-[100px] text-muted-foreground">John Smith:</span>
                        <p>"Hi, I'd like to schedule a haircut appointment for next Tuesday around 2 PM if that's available."</p>
                      </div>
                      <div className="flex gap-2">
                        <span className="font-medium min-w-[100px] text-primary">AI Assistant:</span>
                        <p>"Perfect! I can book you for Tuesday, January 14th at 2:00 PM with Sarah. I'll send you a confirmation text and email. Is there anything specific you'd like done?"</p>
                      </div>
                      <div className="flex gap-2">
                        <span className="font-medium min-w-[100px] text-muted-foreground">John Smith:</span>
                        <p>"Just a regular trim, nothing fancy. That time works great, thank you!"</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>
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
            Four ways Ringlify makes
            <br />
            <span className="text-primary">your calls better</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto">
          <Card className="rounded-3xl overflow-hidden hover:shadow-2xl transition-all">
            <div className="bg-gradient-to-br from-blue-500 to-blue-700 p-8 text-white">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                <div className="bg-gray-900/80 rounded-xl p-4 mb-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="px-3 py-1 rounded-full bg-blue-500 text-xs font-medium">
                      AI Response
                    </div>
                  </div>
                  <p className="text-sm text-gray-200 leading-relaxed">
                    "Based on your business hours, I can offer you Wednesday at 3 PM or Thursday at 10 AM. The Wednesday slot would be with our senior technician who specializes in that service..."
                  </p>
                </div>
                <div className="text-center py-2">
                  <div className="inline-flex items-center gap-1">
                    <div className="w-1 h-3 bg-white/60 rounded-full animate-pulse"></div>
                    <div className="w-1 h-5 bg-white/80 rounded-full animate-pulse" style={{ animationDelay: "0.1s" }}></div>
                    <div className="w-1 h-4 bg-white/70 rounded-full animate-pulse" style={{ animationDelay: "0.2s" }}></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800">
              <h3 className="text-xl font-semibold mb-2">AI that understands context</h3>
              <p className="text-muted-foreground">
                Ringlify uses advanced AI to understand your business, services, and availability to provide intelligent responses in real-time.
              </p>
            </div>
          </Card>

          <Card className="rounded-3xl overflow-hidden hover:shadow-2xl transition-all">
            <div className="bg-gradient-to-br from-purple-500 to-purple-700 p-8 text-white">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 space-y-3">
                <div className="flex items-center justify-between p-3 bg-white/90 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-purple-600" />
                    <div>
                      <p className="font-medium text-sm text-gray-900 dark:text-white">Confirmation Email</p>
                      <p className="text-xs text-muted-foreground">Sent to customer</p>
                    </div>
                  </div>
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                </div>
                <div className="flex items-center justify-between p-3 bg-white/90 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-purple-600" />
                    <div>
                      <p className="font-medium text-sm text-gray-900 dark:text-white">Calendar Updated</p>
                      <p className="text-xs text-muted-foreground">Tuesday, 2:00 PM</p>
                    </div>
                  </div>
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                </div>
              </div>
            </div>
            <div className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-gray-900 dark:to-gray-800">
              <h3 className="text-xl font-semibold mb-2">Automatic follow-ups</h3>
              <p className="text-muted-foreground">
                Send perfectly formatted confirmation emails, calendar invites, and SMS reminders within seconds of every call.
              </p>
            </div>
          </Card>

          <Card className="rounded-3xl overflow-hidden hover:shadow-2xl transition-all">
            <div className="bg-gradient-to-br from-green-500 to-emerald-700 p-8 text-white">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-white/90 dark:bg-gray-800 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">99%</div>
                    <div className="text-xs text-muted-foreground">Success Rate</div>
                  </div>
                  <div className="bg-white/90 dark:bg-gray-800 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">1.2s</div>
                    <div className="text-xs text-muted-foreground">Avg Response</div>
                  </div>
                  <div className="bg-white/90 dark:bg-gray-800 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">24/7</div>
                    <div className="text-xs text-muted-foreground">Available</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-gray-800">
              <h3 className="text-xl font-semibold mb-2">Real-time analytics</h3>
              <p className="text-muted-foreground">
                Track every call with detailed metrics, sentiment analysis, and performance insights that help you optimize your service.
              </p>
            </div>
          </Card>

          <Card className="rounded-3xl overflow-hidden hover:shadow-2xl transition-all">
            <div className="bg-gradient-to-br from-orange-500 to-red-600 p-8 text-white">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                  <span className="text-sm font-medium">Completely undetectable</span>
                </div>
                <p className="text-sm mb-4">
                  Natural conversations that customers love. Our AI speaks like a human, understands context, and never sounds robotic.
                </p>
                <div className="flex gap-2">
                  <Badge className="bg-white/20 border-white/30">Natural Speech</Badge>
                  <Badge className="bg-white/20 border-white/30">Context Aware</Badge>
                </div>
              </div>
            </div>
            <div className="p-6 bg-gradient-to-br from-orange-50 to-red-100 dark:from-gray-900 dark:to-gray-800">
              <h3 className="text-xl font-semibold mb-2">Human-like conversations</h3>
              <p className="text-muted-foreground">
                Powered by advanced AI models trained on millions of real conversations to sound natural and professional.
              </p>
            </div>
          </Card>
        </div>
      </section>

      {/* Integration Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <p className="text-sm text-muted-foreground uppercase tracking-wider mb-4">Works with your existing tools</p>
          <h2 className="text-3xl font-bold mb-4">Seamless integrations</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto items-center">
          {[
            { name: "Twilio", icon: Phone },
            { name: "Google Calendar", icon: Calendar },
            { name: "Stripe", icon: CreditCard },
            { name: "Slack", icon: MessageSquare },
          ].map((integration, i) => (
            <div key={i} className="flex flex-col items-center gap-3 p-6 rounded-2xl hover:bg-muted/50 transition-all">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <integration.icon className="h-6 w-6 text-primary" />
              </div>
              <span className="font-medium text-sm">{integration.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Simple Steps */}
      <section className="container mx-auto px-6 py-20">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Get started in <span className="text-primary">minutes</span>
            </h2>
            <p className="text-xl text-muted-foreground">
              No complex setup required. Start handling calls in 3 simple steps.
            </p>
          </div>

          <div className="space-y-8">
            {[
              {
                step: "1",
                title: "Connect Your Number",
                desc: "Link your existing phone number or get a new one instantly. Works with all major carriers.",
                color: "from-blue-500 to-blue-600"
              },
              {
                step: "2",
                title: "Customize Your AI",
                desc: "Tell us about your business, services, and hours. Our AI learns your preferences in minutes.",
                color: "from-purple-500 to-purple-600"
              },
              {
                step: "3",
                title: "Start Receiving Calls",
                desc: "That's it! Your AI receptionist is ready to handle calls 24/7 while you focus on your business.",
                color: "from-green-500 to-emerald-600"
              }
            ].map((item, i) => (
              <div key={i} className="flex gap-6 items-start">
                <div className={`flex-shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center text-2xl font-bold text-white shadow-lg`}>
                  {item.step}
                </div>
                <div className="flex-1 pt-2">
                  <h3 className="text-2xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground text-lg">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
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
