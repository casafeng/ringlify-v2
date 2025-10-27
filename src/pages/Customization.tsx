import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { KnowledgeBaseManager } from "@/components/KnowledgeBaseManager";

const Customization = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">AI Customization</h1>
          <p className="text-muted-foreground">
            Configure your AI assistant's personality and behavior
          </p>
        </div>

        <Tabs defaultValue="personality" className="space-y-6">
          <TabsList>
            <TabsTrigger value="knowledge">Knowledge Base</TabsTrigger>
            <TabsTrigger value="personality">Personality</TabsTrigger>
            <TabsTrigger value="business">Business Context</TabsTrigger>
            <TabsTrigger value="memory">Memory</TabsTrigger>
            <TabsTrigger value="faqs">FAQs</TabsTrigger>
            <TabsTrigger value="scheduling">Scheduling Logic</TabsTrigger>
          </TabsList>

          <TabsContent value="knowledge" className="space-y-4">
            <KnowledgeBaseManager />
          </TabsContent>

          <TabsContent value="personality" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Personality Settings</CardTitle>
                <CardDescription>
                  Define how your AI assistant communicates
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="tone">Tone</Label>
                  <Input
                    id="tone"
                    placeholder="e.g., Professional, Friendly, Casual"
                    defaultValue="Professional and friendly"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="greeting">Greeting Message</Label>
                  <Textarea
                    id="greeting"
                    placeholder="How should your assistant greet callers?"
                    defaultValue="Hello! Thank you for calling. How may I assist you today?"
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="personality">Personality Traits</Label>
                  <Textarea
                    id="personality"
                    placeholder="Describe your assistant's personality"
                    defaultValue="Helpful, patient, empathetic, and solution-oriented"
                    rows={3}
                  />
                </div>
                <Button>Save Personality Settings</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="business" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Business Context</CardTitle>
                <CardDescription>
                  Provide information about your business
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="business-name">Business Name</Label>
                  <Input
                    id="business-name"
                    placeholder="Your business name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="business-description">Business Description</Label>
                  <Textarea
                    id="business-description"
                    placeholder="What does your business do?"
                    rows={4}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="services">Services Offered</Label>
                  <Textarea
                    id="services"
                    placeholder="List your main services or products"
                    rows={4}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hours">Business Hours</Label>
                  <Input
                    id="hours"
                    placeholder="e.g., Mon-Fri 9AM-5PM"
                  />
                </div>
                <Button>Save Business Context</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="memory" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Memory & Context</CardTitle>
                <CardDescription>
                  Configure what your AI remembers between conversations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="remember">What to Remember</Label>
                  <Textarea
                    id="remember"
                    placeholder="e.g., Customer preferences, previous bookings, common requests"
                    rows={4}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="context">Important Context</Label>
                  <Textarea
                    id="context"
                    placeholder="Any special information the AI should always know"
                    rows={4}
                  />
                </div>
                <Button>Save Memory Settings</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="faqs" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
                <CardDescription>
                  Add common questions and answers for your AI
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="p-4 border rounded-lg space-y-3">
                      <div className="space-y-2">
                        <Label htmlFor={`question-${i}`}>Question {i}</Label>
                        <Input
                          id={`question-${i}`}
                          placeholder="Enter a common question"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`answer-${i}`}>Answer {i}</Label>
                        <Textarea
                          id={`answer-${i}`}
                          placeholder="Enter the answer"
                          rows={2}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <Separator />
                <div className="flex gap-2">
                  <Button variant="outline">Add More FAQ</Button>
                  <Button>Save FAQs</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="scheduling" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Scheduling Logic</CardTitle>
                <CardDescription>
                  Configure how your AI handles appointments
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="booking-duration">Default Booking Duration</Label>
                  <Input
                    id="booking-duration"
                    placeholder="e.g., 30 minutes"
                    defaultValue="30 minutes"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="buffer-time">Buffer Time Between Bookings</Label>
                  <Input
                    id="buffer-time"
                    placeholder="e.g., 15 minutes"
                    defaultValue="15 minutes"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="advance-booking">Advance Booking Window</Label>
                  <Input
                    id="advance-booking"
                    placeholder="e.g., 30 days"
                    defaultValue="30 days"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cancellation">Cancellation Policy</Label>
                  <Textarea
                    id="cancellation"
                    placeholder="Describe your cancellation policy"
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reschedule-rules">Reschedule Rules</Label>
                  <Textarea
                    id="reschedule-rules"
                    placeholder="Rules for rescheduling appointments"
                    rows={3}
                  />
                </div>
                <Button>Save Scheduling Logic</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Customization;
