import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Phone, Loader2, CheckCircle, AlertCircle, Mic, MicOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useCustomer } from "@/contexts/CustomerContext";
import { RealtimeChat } from "@/utils/RealtimeAudio";
import { toast } from "sonner";

interface TestCallStepProps {
  onNext: () => void;
  phoneNumberConfigured: boolean;
}

export const TestCallStep = ({ onNext, phoneNumberConfigured }: TestCallStepProps) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [callStatus, setCallStatus] = useState<'waiting' | 'ringing' | 'success' | 'error'>('waiting');
  const [isBrowserCallActive, setIsBrowserCallActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [transcript, setTranscript] = useState<string[]>([]);
  const chatRef = useRef<RealtimeChat | null>(null);
  const { customerId } = useCustomer();

  useEffect(() => {
    const fetchPhoneNumber = async () => {
      if (!customerId) return;

      const { data } = await supabase
        .from('phone_numbers')
        .select('phone_number, business_phone_number, setup_method')
        .eq('customer_id', customerId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (data) {
        // Show the number they should call (business number for forwarding, twilio number for purchased)
        const numberToCall = data.setup_method === 'forwarding' 
          ? (data.business_phone_number || data.phone_number)
          : data.phone_number;
        setPhoneNumber(numberToCall);
      }
    };

    fetchPhoneNumber();
  }, [customerId]);

  // Real-time listener for test call
  useEffect(() => {
    if (!customerId) return;

    const channel = supabase
      .channel('test-call')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'calls',
          filter: `customer_id=eq.${customerId}`
        },
        (payload) => {
          console.log('Test call detected:', payload);
          setCallStatus('ringing');
          
          // Wait a moment and mark as success
          setTimeout(() => {
            setCallStatus('success');
          }, 2000);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [customerId]);

  const getStatusContent = () => {
    switch (callStatus) {
      case 'waiting':
        return {
          icon: <Phone className="w-12 h-12 text-primary animate-pulse" />,
          title: "Ready for Test Call",
          description: "Call the number below to test your AI assistant"
        };
      case 'ringing':
        return {
          icon: <Loader2 className="w-12 h-12 text-primary animate-spin" />,
          title: "Call Detected!",
          description: "Your AI is answering the call..."
        };
      case 'success':
        return {
          icon: <CheckCircle className="w-12 h-12 text-green-500" />,
          title: "Success! ✨",
          description: "Your AI assistant answered correctly"
        };
      case 'error':
        return {
          icon: <AlertCircle className="w-12 h-12 text-destructive" />,
          title: "Test Failed",
          description: "Please check your configuration and try again"
        };
    }
  };

  const handleBrowserCall = async () => {
    try {
      setIsConnecting(true);
      setTranscript([]);
      
      chatRef.current = new RealtimeChat((event) => {
        console.log("Event:", event);
        
        if (event.type === 'session.created') {
          setIsBrowserCallActive(true);
          setIsConnecting(false);
          toast.success("Connected! Start speaking...");
        } else if (event.type === 'conversation.item.input_audio_transcription.completed') {
          const text = event.transcript;
          if (text) {
            setTranscript(prev => [...prev, `You: ${text}`]);
          }
        } else if (event.type === 'response.audio_transcript.delta') {
          const delta = event.delta;
          if (delta) {
            setTranscript(prev => {
              const lastItem = prev[prev.length - 1];
              if (lastItem && lastItem.startsWith('AI: ')) {
                return [...prev.slice(0, -1), lastItem + delta];
              }
              return [...prev, `AI: ${delta}`];
            });
          }
        } else if (event.type === 'response.audio_transcript.done') {
          // Transcript completed
        } else if (event.type === 'error') {
          console.error("Realtime API error:", event);
          toast.error("Connection error");
          handleEndBrowserCall();
        }
      });
      
      await chatRef.current.init();
    } catch (error) {
      console.error("Error starting browser call:", error);
      toast.error("Failed to start call. Please check microphone permissions.");
      setIsConnecting(false);
      setIsBrowserCallActive(false);
    }
  };

  const handleEndBrowserCall = () => {
    chatRef.current?.disconnect();
    chatRef.current = null;
    setIsBrowserCallActive(false);
    setIsConnecting(false);
    setCallStatus('success');
  };

  const status = getStatusContent();

  if (!phoneNumberConfigured) {
    return (
      <Card className="p-8 text-center">
        <AlertCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
        <p className="text-muted-foreground">
          Please configure a phone number first before testing
        </p>
        <Button className="mt-4" onClick={onNext}>
          Skip Test
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="browser" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="browser">Browser Test</TabsTrigger>
          <TabsTrigger value="phone">Phone Test</TabsTrigger>
        </TabsList>

        <TabsContent value="browser" className="space-y-4">
          <Card className="p-8 text-center space-y-6">
            {isBrowserCallActive ? (
              <>
                <div className="relative">
                  <Mic className="w-12 h-12 text-primary animate-pulse mx-auto" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-20 h-20 bg-primary/20 rounded-full animate-ping" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Call Active</h3>
                  <p className="text-muted-foreground">Speak naturally with your AI assistant</p>
                </div>

                {transcript.length > 0 && (
                  <div className="bg-muted p-4 rounded-lg max-h-60 overflow-y-auto text-left">
                    {transcript.map((line, i) => (
                      <p key={i} className="text-sm mb-2">
                        {line}
                      </p>
                    ))}
                  </div>
                )}

                <Button onClick={handleEndBrowserCall} variant="destructive" className="w-full">
                  <MicOff className="w-4 h-4 mr-2" />
                  End Call
                </Button>
              </>
            ) : (
              <>
                <Phone className="w-12 h-12 text-primary mx-auto" />
                <div>
                  <h3 className="text-xl font-semibold mb-2">Test in Browser</h3>
                  <p className="text-muted-foreground">
                    Click below to start a voice conversation with your AI assistant
                  </p>
                </div>

                <div className="bg-primary/5 p-4 rounded-lg text-sm text-left space-y-2">
                  <p className="font-medium">What to expect:</p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    <li>Allow microphone access when prompted</li>
                    <li>The AI will greet you automatically</li>
                    <li>Speak naturally, the AI will respond in real-time</li>
                    <li>Try asking about your business or services</li>
                  </ul>
                </div>

                <Button 
                  onClick={handleBrowserCall} 
                  disabled={isConnecting}
                  className="w-full"
                >
                  {isConnecting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    <>
                      <Mic className="w-4 h-4 mr-2" />
                      Start Browser Call
                    </>
                  )}
                </Button>
              </>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="phone" className="space-y-4">
          <Card className="p-8 text-center space-y-6">
            {status.icon}
            <div>
              <h3 className="text-xl font-semibold mb-2">{status.title}</h3>
              <p className="text-muted-foreground">{status.description}</p>
            </div>

            {phoneNumber && (
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-6 space-y-2">
                <p className="text-sm text-muted-foreground">Call this number now:</p>
                <a 
                  href={`tel:${phoneNumber}`}
                  className="text-3xl font-bold text-primary hover:underline"
                >
                  {phoneNumber}
                </a>
              </div>
            )}

            {callStatus === 'waiting' && (
              <p className="text-sm text-muted-foreground">
                Waiting for your test call... The AI will automatically answer and greet you.
              </p>
            )}
          </Card>
        </TabsContent>
      </Tabs>

      {callStatus === 'success' && (
        <div className="flex justify-end">
          <Button size="lg" onClick={onNext}>
            Complete Setup
          </Button>
        </div>
      )}

      {callStatus === 'waiting' && !isBrowserCallActive && (
        <div className="flex justify-center">
          <Button variant="ghost" onClick={onNext}>
            Skip test for now
          </Button>
        </div>
      )}
    </div>
  );
};
