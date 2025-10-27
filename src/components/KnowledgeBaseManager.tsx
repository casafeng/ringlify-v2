import { useState } from "react";
import { useKnowledgeBase } from "@/hooks/useKnowledgeBase";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, FileText, Globe, File } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { AddKnowledgeDialog } from "./knowledge/AddKnowledgeDialog";

export const KnowledgeBaseManager = () => {
  const { documents, isLoading, updateDocument, deleteDocument } = useKnowledgeBase();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleToggleActive = async (doc: any) => {
    await updateDocument.mutateAsync({
      id: doc.id,
      is_active: !doc.is_active,
    });
  };

  const getSourceIcon = (sourceType?: string) => {
    switch (sourceType) {
      case 'website':
        return <Globe className="w-4 h-4" />;
      case 'document':
        return <File className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading knowledge base...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm text-muted-foreground">
            {documents.length} {documents.length === 1 ? 'source' : 'sources'} added
          </p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)} size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Add
        </Button>
      </div>

      <AddKnowledgeDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />

      <Card>
        <CardHeader>
          <CardTitle>Knowledge Sources</CardTitle>
          <CardDescription>
            Manage the information your AI assistant can access
          </CardDescription>
        </CardHeader>
        <CardContent>
          {documents.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg mb-2">No sources yet</p>
              <p className="text-sm">Add your first knowledge source to get started</p>
            </div>
          ) : (
            <div className="space-y-3">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-start justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      {getSourceIcon(doc.source_type)}
                      <h3 className="font-semibold">{doc.title}</h3>
                      {doc.source_type && (
                        <Badge variant="secondary" className="text-xs capitalize">
                          {doc.source_type}
                        </Badge>
                      )}
                      {!doc.is_active && (
                        <Badge variant="outline" className="text-xs">
                          Inactive
                        </Badge>
                      )}
                    </div>
                    {doc.source_url && doc.source_type === 'website' && (
                      <p className="text-xs text-muted-foreground">
                        {doc.source_url}
                      </p>
                    )}
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {doc.content}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Last updated: {new Date(doc.updated_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={doc.is_active}
                        onCheckedChange={() => handleToggleActive(doc)}
                      />
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        if (confirm("Are you sure you want to delete this source?")) {
                          deleteDocument.mutate(doc.id);
                        }
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
