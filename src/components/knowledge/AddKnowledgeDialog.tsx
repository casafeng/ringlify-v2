import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Globe, FileUp, FileText } from "lucide-react";
import { WebsiteTab } from "./WebsiteTab";
import { DocumentTab } from "./DocumentTab";
import { TextTab } from "./TextTab";

interface AddKnowledgeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AddKnowledgeDialog = ({ open, onOpenChange }: AddKnowledgeDialogProps) => {
  const [activeTab, setActiveTab] = useState("website");

  const handleSuccess = () => {
    onOpenChange(false);
    setActiveTab("website");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add to Knowledge Base</DialogTitle>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="website" className="gap-2">
              <Globe className="h-4 w-4" />
              Website
            </TabsTrigger>
            <TabsTrigger value="document" className="gap-2">
              <FileUp className="h-4 w-4" />
              Document
            </TabsTrigger>
            <TabsTrigger value="text" className="gap-2">
              <FileText className="h-4 w-4" />
              Text
            </TabsTrigger>
          </TabsList>

          <TabsContent value="website" className="space-y-4">
            <WebsiteTab onSuccess={handleSuccess} />
          </TabsContent>

          <TabsContent value="document" className="space-y-4">
            <DocumentTab onSuccess={handleSuccess} />
          </TabsContent>

          <TabsContent value="text" className="space-y-4">
            <TextTab onSuccess={handleSuccess} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
