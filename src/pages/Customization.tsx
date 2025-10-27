import { DashboardLayout } from "@/components/DashboardLayout";
import { TonePersonalitySection } from "@/components/customization/TonePersonalitySection";
import { BusinessInfoSection } from "@/components/customization/BusinessInfoSection";
import { CapabilitiesSection } from "@/components/customization/CapabilitiesSection";
import { KnowledgeBaseManager } from "@/components/KnowledgeBaseManager";
import { SaveIndicator } from "@/components/customization/SaveIndicator";
import { TestChatSection } from "@/components/customization/TestChatSection";
import { useAIConfiguration } from "@/hooks/useAIConfiguration";
import { useAutoSave } from "@/hooks/useAutoSave";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const Customization = () => {
  const { config, isLoading, updateConfig } = useAIConfiguration();

  const { triggerSave, isSaving, lastSaved } = useAutoSave((data: any) => {
    updateConfig.mutate(data);
  });

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-12">
          <p className="text-muted-foreground">Loading configuration...</p>
        </div>
      </DashboardLayout>
    );
  }

  const handleChange = (updates: any) => {
    triggerSave(updates);
  };

  const handleCapabilitiesChange = (capabilities: Record<string, boolean>) => {
    const currentMemory = (config?.memory_settings as Record<string, any>) || {};
    handleChange({
      memory_settings: {
        ...currentMemory,
        capabilities,
      },
    });
  };

  // Parse business context
  const businessContext = config?.business_context || "";
  const businessName = businessContext.match(/Business: (.*)/)?.[1]?.split("\n")[0] || "";
  const serviceType = businessContext.match(/Type: (.*)/)?.[1]?.split("\n")[0] || "";

  const handleBusinessChange = (data: { businessName?: string; serviceType?: string }) => {
    const newBusinessName = data.businessName ?? businessName;
    const newServiceType = data.serviceType ?? serviceType;
    handleChange({
      business_context: `Business: ${newBusinessName}\nType: ${newServiceType}`,
    });
  };

  const capabilities = (config?.memory_settings as any)?.capabilities || {};

  return (
    <DashboardLayout>
      <div className="space-y-8 pb-16">
        {/* Sticky Header */}
        <div className="sticky top-16 z-10 -mx-6 -mt-6 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b px-6 py-4">
          <div className="flex items-center justify-between max-w-7xl">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">AI Customization</h1>
              <p className="text-muted-foreground mt-1">
                Configure how your AI assistant behaves and responds
              </p>
            </div>
            <SaveIndicator isSaving={isSaving} lastSaved={lastSaved} />
          </div>
        </div>

        <div className="max-w-7xl space-y-8">
          {/* Business Information Section */}
          <section className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold tracking-tight">Business Information</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Essential details about your business
              </p>
            </div>
            <Card>
              <CardContent className="pt-6">
                <BusinessInfoSection
                  businessName={businessName}
                  serviceType={serviceType}
                  onChange={handleBusinessChange}
                />
              </CardContent>
            </Card>
          </section>

          <Separator />

          {/* Tone & Personality Section */}
          <section className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold tracking-tight">Tone & Personality</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Define how your assistant communicates
              </p>
            </div>
            <Card>
              <CardContent className="pt-6">
                <TonePersonalitySection
                  tone={config?.tone || "professional"}
                  greeting={config?.greeting || ""}
                  onChange={handleChange}
                />
              </CardContent>
            </Card>
          </section>

          <Separator />

          {/* Capabilities Section */}
          <section className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold tracking-tight">Capabilities</h2>
              <p className="text-sm text-muted-foreground mt-1">
                {Object.values(capabilities).filter(Boolean).length} of {Object.keys(capabilities).length} features enabled
              </p>
            </div>
            <CapabilitiesSection
              enabledCapabilities={capabilities}
              onChange={handleCapabilitiesChange}
            />
          </section>

          <Separator />

          {/* Knowledge Base Section */}
          <section className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold tracking-tight">Knowledge Base</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Add information for your assistant to reference
              </p>
            </div>
            <KnowledgeBaseManager />
          </section>

          <Separator />

          {/* Test Chat Section */}
          <section className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold tracking-tight">Test Your Assistant</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Try out how your AI will respond with the current configuration
              </p>
            </div>
            <TestChatSection />
          </section>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Customization;
