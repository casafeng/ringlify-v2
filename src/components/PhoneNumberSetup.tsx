import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Phone, Search, Loader2, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface PhoneNumber {
  friendly_name: string;
  phone_number: string;
  capabilities: {
    voice: boolean;
    SMS: boolean;
    MMS: boolean;
  };
}

export const PhoneNumberSetup = () => {
  const [areaCode, setAreaCode] = useState("");
  const [searching, setSearching] = useState(false);
  const [purchasing, setPurchasing] = useState<string | null>(null);
  const [availableNumbers, setAvailableNumbers] = useState<PhoneNumber[]>([]);
  const [ownedNumbers, setOwnedNumbers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const searchNumbers = async () => {
    if (!areaCode || areaCode.length !== 3) {
      toast.error("Please enter a valid 3-digit area code");
      return;
    }

    setSearching(true);
    try {
      const { data, error } = await supabase.functions.invoke('provision-twilio-number', {
        body: { action: 'search', areaCode },
      });

      if (error) throw error;
      
      setAvailableNumbers(data.numbers || []);
      
      if (data.numbers?.length === 0) {
        toast.info(`No numbers available in area code ${areaCode}`);
      } else {
        toast.success(`Found ${data.numbers.length} available numbers`);
      }
    } catch (error: any) {
      console.error('Error searching numbers:', error);
      toast.error(error.message || "Failed to search phone numbers");
    } finally {
      setSearching(false);
    }
  };

  const purchaseNumber = async (phoneNumber: string) => {
    setPurchasing(phoneNumber);
    try {
      const { data, error } = await supabase.functions.invoke('provision-twilio-number', {
        body: { 
          action: 'purchase', 
          phoneNumberSid: phoneNumber,
          areaCode 
        },
      });

      if (error) throw error;
      
      toast.success(`Successfully purchased ${phoneNumber}`);
      
      // Refresh owned numbers
      await loadOwnedNumbers();
      
      // Clear search results
      setAvailableNumbers([]);
      setAreaCode("");
    } catch (error: any) {
      console.error('Error purchasing number:', error);
      toast.error(error.message || "Failed to purchase phone number");
    } finally {
      setPurchasing(null);
    }
  };

  const loadOwnedNumbers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('provision-twilio-number', {
        body: { action: 'list' },
      });

      if (error) throw error;
      setOwnedNumbers(data.numbers || []);
    } catch (error: any) {
      console.error('Error loading numbers:', error);
      toast.error("Failed to load phone numbers");
    } finally {
      setLoading(false);
    }
  };

  // Load owned numbers on mount
  useEffect(() => {
    loadOwnedNumbers();
  }, []);

  return (
    <div className="space-y-6">
      {/* Current Numbers */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5" />
            Your Phone Numbers
          </CardTitle>
          <CardDescription>
            Manage your Twilio phone numbers configured for AI calls
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : ownedNumbers.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Phone className="h-12 w-12 mx-auto mb-4 opacity-20" />
              <p>No phone numbers yet. Purchase one below to get started.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {ownedNumbers.map((number) => (
                <div
                  key={number.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">{number.phone_number}</p>
                      <p className="text-sm text-muted-foreground">
                        Added {new Date(number.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Badge variant={number.status === 'active' ? 'default' : 'secondary'}>
                    {number.status}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Search & Purchase */}
      <Card>
        <CardHeader>
          <CardTitle>Purchase New Number</CardTitle>
          <CardDescription>
            Search for available phone numbers by area code
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Enter area code (e.g., 415)"
              value={areaCode}
              onChange={(e) => setAreaCode(e.target.value.replace(/\D/g, '').slice(0, 3))}
              maxLength={3}
              className="max-w-xs"
            />
            <Button 
              onClick={searchNumbers} 
              disabled={searching || areaCode.length !== 3}
            >
              {searching ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Search className="h-4 w-4 mr-2" />
              )}
              Search
            </Button>
          </div>

          {availableNumbers.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium">Available Numbers:</p>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {availableNumbers.map((number) => (
                  <div
                    key={number.phone_number}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{number.friendly_name}</p>
                        <div className="flex gap-2 mt-1">
                          {number.capabilities.voice && (
                            <Badge variant="outline" className="text-xs">Voice</Badge>
                          )}
                          {number.capabilities.SMS && (
                            <Badge variant="outline" className="text-xs">SMS</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => purchaseNumber(number.phone_number)}
                      disabled={purchasing !== null}
                    >
                      {purchasing === number.phone_number ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                      )}
                      Purchase
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
