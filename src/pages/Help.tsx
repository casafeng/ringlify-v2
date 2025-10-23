import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Search, MessageCircle, FileText, Video, ExternalLink } from "lucide-react";

const faqs = [
  {
    question: "How do I set up my AI receptionist?",
    answer: "Setting up your AI receptionist is easy! Navigate to Settings, configure your business hours, add your services, and connect your calendar. The AI will start answering calls immediately.",
  },
  {
    question: "Can customers book appointments directly?",
    answer: "Yes! Your AI receptionist can check your calendar availability in real-time and book appointments automatically. Customers receive instant confirmations via WhatsApp, SMS, or email.",
  },
  {
    question: "What happens if the AI can't handle a call?",
    answer: "If the AI encounters a complex situation it can't handle, it will seamlessly transfer the call to a human staff member. All context is preserved so your team can help immediately.",
  },
  {
    question: "How accurate is the call transcription?",
    answer: "We use industry-leading Deepgram ASR technology with 95%+ accuracy. All transcripts are automatically saved and searchable in your dashboard.",
  },
  {
    question: "Can I customize the AI's responses?",
    answer: "Absolutely! You can customize greetings, add business-specific FAQs, and adjust the AI's tone to match your brand. Visit the Knowledge Base section in Settings.",
  },
  {
    question: "Is my data secure and GDPR compliant?",
    answer: "Yes. All data is encrypted, stored in EU servers, and we're fully GDPR compliant. You can export or delete customer data at any time.",
  },
];

const Help = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Help Center</h1>
          <p className="text-muted-foreground">
            Get answers and support for your Ringlify account
          </p>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search for help..."
            className="pl-10 rounded-xl h-12"
          />
        </div>

        {/* Quick Links */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="rounded-2xl shadow-sm hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="pt-6 text-center">
              <div className="inline-flex p-3 rounded-lg bg-primary/10 mb-3">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-1">Documentation</h3>
              <p className="text-sm text-muted-foreground">
                Complete guides and tutorials
              </p>
            </CardContent>
          </Card>
          <Card className="rounded-2xl shadow-sm hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="pt-6 text-center">
              <div className="inline-flex p-3 rounded-lg bg-success/10 mb-3">
                <Video className="h-6 w-6 text-success" />
              </div>
              <h3 className="font-semibold mb-1">Video Tutorials</h3>
              <p className="text-sm text-muted-foreground">
                Step-by-step video guides
              </p>
            </CardContent>
          </Card>
          <Card className="rounded-2xl shadow-sm hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="pt-6 text-center">
              <div className="inline-flex p-3 rounded-lg bg-chart-2/10 mb-3">
                <MessageCircle className="h-6 w-6 text-chart-2" />
              </div>
              <h3 className="font-semibold mb-1">Live Chat</h3>
              <p className="text-sm text-muted-foreground">
                Chat with our support team
              </p>
            </CardContent>
          </Card>
          <Card className="rounded-2xl shadow-sm hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="pt-6 text-center">
              <div className="inline-flex p-3 rounded-lg bg-chart-4/10 mb-3">
                <ExternalLink className="h-6 w-6 text-chart-4" />
              </div>
              <h3 className="font-semibold mb-1">API Docs</h3>
              <p className="text-sm text-muted-foreground">
                Developer documentation
              </p>
            </CardContent>
          </Card>
        </div>

        {/* FAQs */}
        <Card className="rounded-2xl shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

        {/* Contact Form */}
        <Card className="rounded-2xl shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Still Need Help?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium mb-2 block">Name</label>
                <Input placeholder="Your name" />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Email</label>
                <Input type="email" placeholder="your@email.com" />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Subject</label>
              <Input placeholder="Brief description of your issue" />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Message</label>
              <Textarea
                placeholder="Please describe your issue in detail..."
                rows={5}
              />
            </div>
            <Button className="w-full">
              <MessageCircle className="h-4 w-4 mr-2" />
              Send Message
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Help;
