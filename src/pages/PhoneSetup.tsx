import { DashboardLayout } from "@/components/DashboardLayout";
import { PhoneNumberSetup } from "@/components/PhoneNumberSetup";

const PhoneSetup = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Phone Setup</h1>
          <p className="text-muted-foreground">
            Configure your Twilio phone numbers for AI voice calls
          </p>
        </div>
        
        <PhoneNumberSetup />
      </div>
    </DashboardLayout>
  );
};

export default PhoneSetup;
