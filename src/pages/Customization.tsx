import { DashboardLayout } from "@/components/DashboardLayout";
import { TonePersonalitySection } from "@/components/customization/TonePersonalitySection";
import { BusinessInfoSection } from "@/components/customization/BusinessInfoSection";
import { CapabilitiesSection } from "@/components/customization/CapabilitiesSection";
import { KnowledgeBaseManager } from "@/components/KnowledgeBaseManager";
import { SaveIndicator } from "@/components/customization/SaveIndicator";
import { useAIConfiguration } from "@/hooks/useAIConfiguration";
import { useAutoSave } from "@/hooks/useAutoSave";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

const Customization = () => {
  const { config, isLoading, updateConfig } = useAIConfiguration();
  const [isCapabilitiesOpen, setIsCapabilitiesOpen] = useState(false);
  const [isKnowledgeOpen, setIsKnowledgeOpen] = useState(false);

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
      <div className="max-w-4xl space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">AI Customization</h1>
            <p className="text-muted-foreground">
              Make your assistant act, speak, and think the way you want
            </p>
          </div>
          <SaveIndicator isSaving={isSaving} lastSaved={lastSaved} />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>The Basics</CardTitle>
            <CardDescription>Essential information about your business</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <BusinessInfoSection
              businessName={businessName}
              serviceType={serviceType}
              onChange={handleBusinessChange}
            />
            
            <div className="pt-2 border-t">
              <TonePersonalitySection
                tone={config?.tone || "professional"}
                greeting={config?.greeting || ""}
                onChange={handleChange}
              />
            </div>
          </CardContent>
        </Card>

        <Collapsible open={isCapabilitiesOpen} onOpenChange={setIsCapabilitiesOpen}>
          <Card>
            <CardHeader className="cursor-pointer" onClick={() => setIsCapabilitiesOpen(!isCapabilitiesOpen)}>
              <CollapsibleTrigger className="flex items-center justify-between w-full">
                <div className="text-left">
                  <CardTitle>What Can It Do?</CardTitle>
                  <CardDescription>
                    {Object.values(capabilities).filter(Boolean).length} capabilities enabled
                  </CardDescription>
                </div>
                <ChevronDown
                  className={`h-5 w-5 transition-transform ${
                    isCapabilitiesOpen ? "rotate-180" : ""
                  }`}
                />
              </CollapsibleTrigger>
            </CardHeader>
            <CollapsibleContent>
              <CardContent>
                <CapabilitiesSection
                  enabledCapabilities={capabilities}
                  onChange={handleCapabilitiesChange}
                />
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>

        <Collapsible open={isKnowledgeOpen} onOpenChange={setIsKnowledgeOpen}>
          <Card>
            <CardHeader className="cursor-pointer" onClick={() => setIsKnowledgeOpen(!isKnowledgeOpen)}>
              <CollapsibleTrigger className="flex items-center justify-between w-full">
                <div className="text-left">
                  <CardTitle>Knowledge Base</CardTitle>
                  <CardDescription>
                    Add documents and information for your assistant
                  </CardDescription>
                </div>
                <ChevronDown
                  className={`h-5 w-5 transition-transform ${
                    isKnowledgeOpen ? "rotate-180" : ""
                  }`}
                />
              </CollapsibleTrigger>
            </CardHeader>
            <CollapsibleContent>
              <CardContent>
                <KnowledgeBaseManager />
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>
      </div>
    </DashboardLayout>
  );
};

export default Customization;
