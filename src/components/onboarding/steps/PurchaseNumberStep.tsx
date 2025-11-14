import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Phone, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface PurchaseNumberStepProps {
  onNext: () => void;
  setPhoneNumberConfigured: (configured: boolean) => void;
}

interface PhoneNumber {
  phoneNumber: string;
  friendlyName: string;
  capabilities: {
    voice: boolean;
    SMS: boolean;
    MMS: boolean;
  };
}

export const PurchaseNumberStep = ({ onNext, setPhoneNumberConfigured }: PurchaseNumberStepProps) => {
  const [areaCode, setAreaCode] = useState("");
  const [searchResults, setSearchResults] = useState<PhoneNumber[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isPurchasing, setIsPurchasing] = useState(false);

  const handleSearch = async () => {
    if (!areaCode || areaCode.length !== 3) {
      toast.error("Please enter a valid 3-digit area code");
      return;
    }

    setIsSearching(true);
    try {
      const { data, error } = await supabase.functions.invoke('provision-twilio-number', {
        body: { action: 'search', areaCode }
      });

      if (error) throw error;

      setSearchResults(data.availableNumbers || []);
      if (data.availableNumbers?.length === 0) {
        toast.error("No numbers found in this area code");
      }
    } catch (error) {
      console.error('Error searching numbers:', error);
      toast.error("Failed to search for numbers");
    } finally {
      setIsSearching(false);
    }
  };

  const handlePurchase = async (phoneNumber: string) => {
    setIsPurchasing(true);
    try {
      const { data, error } = await supabase.functions.invoke('provision-twilio-number', {
        body: { action: 'purchase', phoneNumber }
      });

      if (error) throw error;

      toast.success("Phone number purchased successfully!");
      setPhoneNumberConfigured(true);
      onNext();
    } catch (error) {
      console.error('Error purchasing number:', error);
      toast.error("Failed to purchase number");
    } finally {
      setIsPurchasing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="area-code">Search by Area Code</Label>
          <div className="flex gap-2">
            <Input
              id="area-code"
              type="text"
              placeholder="e.g., 415"
              value={areaCode}
              onChange={(e) => setAreaCode(e.target.value.replace(/\D/g, '').slice(0, 3))}
              maxLength={3}
              disabled={isSearching}
            />
            <Button onClick={handleSearch} disabled={isSearching}>
              {isSearching ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Searching...
                </>
              ) : (
                "Search"
              )}
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Enter a 3-digit area code to find available numbers
          </p>
        </div>
      </div>

      {searchResults.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-semibold">Available Numbers</h4>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {searchResults.map((number) => (
              <Card key={number.phoneNumber} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-medium">{number.friendlyName}</p>
                      <p className="text-xs text-muted-foreground">
                        Voice: {number.capabilities.voice ? '✓' : '✗'} | 
                        SMS: {number.capabilities.SMS ? '✓' : '✗'}
                      </p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handlePurchase(number.phoneNumber)}
                    disabled={isPurchasing}
                  >
                    {isPurchasing ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      "Purchase"
                    )}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {searchResults.length === 0 && !isSearching && (
        <Card className="p-8 text-center text-muted-foreground">
          <Phone className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Search for available numbers by area code</p>
        </Card>
      )}
    </div>
  );
};
