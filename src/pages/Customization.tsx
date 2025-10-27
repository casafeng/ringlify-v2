import { DashboardLayout } from "@/components/DashboardLayout";
import { TonePersonalitySection } from "@/components/customization/TonePersonalitySection";
import { TasksCapabilitiesSection } from "@/components/customization/TasksCapabilitiesSection";
import { BusinessInfoSection } from "@/components/customization/BusinessInfoSection";
import { KnowledgeBaseManager } from "@/components/KnowledgeBaseManager";
import { MemoryLogicSection } from "@/components/customization/MemoryLogicSection";
import { useAIConfiguration } from "@/hooks/useAIConfiguration";

const Customization = () => {
  const { config, isLoading, updateConfig } = useAIConfiguration();

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-12">
          <p className="text-muted-foreground">Loading configuration...</p>
        </div>
      </DashboardLayout>
    );
  }

  const handleTonePersonalitySave = (data: { tone: string; personality: string; greeting: string }) => {
    updateConfig.mutate({
      tone: data.tone,
      personality: data.personality,
      greeting: data.greeting,
    });
  };

  const handleTasksSave = (capabilities: Record<string, boolean>) => {
    const currentMemory = (config?.memory_settings as Record<string, any>) || {};
    updateConfig.mutate({
      memory_settings: {
        ...currentMemory,
        capabilities,
      },
    });
  };

  const handleBusinessInfoSave = (data: { businessName: string; serviceType: string; context: string }) => {
    updateConfig.mutate({
      business_context: `Business: ${data.businessName}\nType: ${data.serviceType}\n\n${data.context}`,
    });
  };

  const handleMemorySave = (settings: Record<string, boolean>) => {
    const currentMemory = (config?.memory_settings as Record<string, any>) || {};
    updateConfig.mutate({
      memory_settings: {
        ...currentMemory,
        ...settings,
      },
    });
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">AI Customization</h1>
          <p className="text-muted-foreground">
            Make your assistant act, speak, and think the way you want
          </p>
        </div>

        <TonePersonalitySection
          defaultTone={config?.tone || "professional"}
          defaultPersonality={config?.personality || ""}
          defaultGreeting={config?.greeting || ""}
          onSave={handleTonePersonalitySave}
        />

        <TasksCapabilitiesSection
          defaultCapabilities={(config?.memory_settings as any)?.capabilities || {}}
          onSave={handleTasksSave}
        />

        <BusinessInfoSection
          defaultBusinessName=""
          defaultServiceType=""
          defaultContext={config?.business_context || ""}
          onSave={handleBusinessInfoSave}
        />

        <KnowledgeBaseManager />

        <MemoryLogicSection
          defaultSettings={(config?.memory_settings as Record<string, boolean>) || {}}
          onSave={handleMemorySave}
        />
      </div>
    </DashboardLayout>
  );
};

export default Customization;
