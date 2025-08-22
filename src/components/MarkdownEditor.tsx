import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EditIcon, EyeIcon, TrashIcon } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

interface Note {
  id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  user_id: string;
}

interface MarkdownEditorProps {
  note: Note | null;
  onUpdateNote: (id: string, title: string, content: string) => void;
  onDeleteNote: (id: string) => void;
  loading: boolean;
}

const MarkdownEditor = ({ note, onUpdateNote, onDeleteNote, loading }: MarkdownEditorProps) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [activeTab, setActiveTab] = useState("edit");

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
    }
  }, [note]);

  const handleSave = () => {
    if (note) {
      onUpdateNote(note.id, title, content);
    }
  };

  const handleDelete = () => {
    if (note && confirm("Are you sure you want to delete this note?")) {
      onDeleteNote(note.id);
    }
  };

  const hasChanges = note && (title !== note.title || content !== note.content);

  if (!note) {
    return (
      <div className="flex-1 flex items-center justify-center bg-editor-bg">
        <div className="text-center text-muted-foreground">
          <EditIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <h3 className="text-xl font-medium mb-2">Select a note to edit</h3>
          <p>Choose a note from the sidebar or create a new one</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-editor-bg">
      {/* Header */}
      <div className="border-b border-border p-4 bg-card">
        <div className="flex items-center justify-between">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Note title..."
            className="text-xl font-semibold border-0 shadow-none px-0 bg-transparent focus-visible:ring-0"
          />
          <div className="flex items-center space-x-2">
            {hasChanges && (
              <Button 
                onClick={handleSave}
                disabled={loading}
                className="bg-gradient-primary hover:bg-primary-hover transition-smooth"
              >
                Save
              </Button>
            )}
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleDelete}
              disabled={loading}
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <TrashIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 p-4">
        <Card className="h-full border-0 shadow-soft">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
            <TabsList className="w-fit mx-4 mt-4">
              <TabsTrigger value="edit" className="flex items-center space-x-2">
                <EditIcon className="h-4 w-4" />
                <span>Edit</span>
              </TabsTrigger>
              <TabsTrigger value="preview" className="flex items-center space-x-2">
                <EyeIcon className="h-4 w-4" />
                <span>Preview</span>
              </TabsTrigger>
            </TabsList>
            
            <div className="flex-1 p-4 pt-2">
              <TabsContent value="edit" className="h-full mt-0">
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Start writing your note in Markdown..."
                  className={cn(
                    "w-full h-full resize-none border-0 outline-none bg-transparent",
                    "text-foreground placeholder:text-muted-foreground",
                    "font-mono text-sm leading-relaxed"
                  )}
                />
              </TabsContent>
              
              <TabsContent value="preview" className="h-full mt-0 overflow-auto">
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {content || "Nothing to preview yet. Start writing in the Edit tab."}
                  </ReactMarkdown>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default MarkdownEditor;