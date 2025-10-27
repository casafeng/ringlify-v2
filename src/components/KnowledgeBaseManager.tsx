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
      <AddKnowledgeDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />

      {documents.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="rounded-full bg-muted p-4 mb-4">
              <FileText className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No knowledge sources yet</h3>
            <p className="text-sm text-muted-foreground mb-6 text-center max-w-sm">
              Add documents, websites, or text to help your assistant provide better answers
            </p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Source
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {documents.length} {documents.length === 1 ? 'source' : 'sources'} • {documents.filter(d => d.is_active).length} active
            </p>
            <Button onClick={() => setIsDialogOpen(true)} size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Source
            </Button>
          </div>

          <div className="grid gap-4">
            {documents.map((doc) => (
              <Card key={doc.id} className="group hover:shadow-md transition-all">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex gap-4 flex-1 min-w-0">
                      <div className="rounded-lg bg-muted p-2.5 h-fit">
                        {getSourceIcon(doc.source_type)}
                      </div>
                      <div className="flex-1 min-w-0 space-y-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold text-base">{doc.title}</h3>
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
                          <p className="text-xs text-muted-foreground truncate">
                            {doc.source_url}
                          </p>
                        )}
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {doc.content}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Last updated {new Date(doc.updated_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">Active</span>
                        <Switch
                          checked={doc.is_active}
                          onCheckedChange={() => handleToggleActive(doc)}
                        />
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
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
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
