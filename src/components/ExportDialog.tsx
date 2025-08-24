import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, FileText, Hash, File } from 'lucide-react';
import { toast } from 'sonner';
import jsPDF from 'jspdf';

interface Note {
  id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  pinned: boolean;
  tags: string[];
}

interface ExportDialogProps {
  notes: Note[];
  selectedNote?: Note | null;
  children: React.ReactNode;
}

export const ExportDialog = ({ notes, selectedNote, children }: ExportDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [exportType, setExportType] = useState<'current' | 'all'>('current');

  const exportAsMarkdown = (notesToExport: Note[]) => {
    let content = '';
    
    notesToExport.forEach((note, index) => {
      if (index > 0) content += '\n\n---\n\n';
      
      content += `# ${note.title}\n\n`;
      
      if (note.tags && note.tags.length > 0) {
        content += `**Tags:** ${note.tags.join(', ')}\n\n`;
      }
      
      content += `**Created:** ${new Date(note.created_at).toLocaleDateString()}\n`;
      content += `**Last Modified:** ${new Date(note.updated_at).toLocaleDateString()}\n\n`;
      content += note.content;
    });

    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `notes-${new Date().toISOString().split('T')[0]}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('Notes exported as Markdown');
  };

  const exportAsText = (notesToExport: Note[]) => {
    let content = '';
    
    notesToExport.forEach((note, index) => {
      if (index > 0) content += '\n\n' + '='.repeat(50) + '\n\n';
      
      content += `${note.title}\n`;
      content += '='.repeat(note.title.length) + '\n\n';
      
      if (note.tags && note.tags.length > 0) {
        content += `Tags: ${note.tags.join(', ')}\n\n`;
      }
      
      content += `Created: ${new Date(note.created_at).toLocaleDateString()}\n`;
      content += `Last Modified: ${new Date(note.updated_at).toLocaleDateString()}\n\n`;
      
      // Strip markdown formatting for plain text
      const plainContent = note.content
        .replace(/#{1,6}\s+/g, '') // Remove headers
        .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
        .replace(/\*(.*?)\*/g, '$1') // Remove italic
        .replace(/`(.*?)`/g, '$1') // Remove inline code
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1'); // Remove links
      
      content += plainContent;
    });

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `notes-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('Notes exported as text');
  };

  const exportAsPDF = async (notesToExport: Note[]) => {
    try {
      const pdf = new jsPDF();
      const pageHeight = pdf.internal.pageSize.height;
      const pageWidth = pdf.internal.pageSize.width;
      const margin = 20;
      const maxWidth = pageWidth - 2 * margin;
      let yPosition = margin;

      notesToExport.forEach((note, noteIndex) => {
        // Add new page for each note (except the first)
        if (noteIndex > 0) {
          pdf.addPage();
          yPosition = margin;
        }

        // Title
        pdf.setFontSize(16);
        pdf.setFont('helvetica', 'bold');
        const titleLines = pdf.splitTextToSize(note.title, maxWidth);
        pdf.text(titleLines, margin, yPosition);
        yPosition += titleLines.length * 8 + 10;

        // Tags
        if (note.tags && note.tags.length > 0) {
          pdf.setFontSize(10);
          pdf.setFont('helvetica', 'normal');
          pdf.text(`Tags: ${note.tags.join(', ')}`, margin, yPosition);
          yPosition += 15;
        }

        // Dates
        pdf.setFontSize(8);
        pdf.setFont('helvetica', 'normal');
        pdf.text(`Created: ${new Date(note.created_at).toLocaleDateString()}`, margin, yPosition);
        yPosition += 10;
        pdf.text(`Last Modified: ${new Date(note.updated_at).toLocaleDateString()}`, margin, yPosition);
        yPosition += 20;

        // Content
        pdf.setFontSize(11);
        pdf.setFont('helvetica', 'normal');
        
        // Strip markdown formatting
        const plainContent = note.content
          .replace(/#{1,6}\s+/g, '') // Remove headers
          .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
          .replace(/\*(.*?)\*/g, '$1') // Remove italic
          .replace(/`(.*?)`/g, '$1') // Remove inline code
          .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1'); // Remove links

        const contentLines = pdf.splitTextToSize(plainContent, maxWidth);
        
        contentLines.forEach((line: string) => {
          if (yPosition > pageHeight - margin) {
            pdf.addPage();
            yPosition = margin;
          }
          pdf.text(line, margin, yPosition);
          yPosition += 5;
        });
      });

      pdf.save(`notes-${new Date().toISOString().split('T')[0]}.pdf`);
      toast.success('Notes exported as PDF');
    } catch (error) {
      toast.error('Failed to export PDF');
    }
  };

  const handleExport = (format: 'markdown' | 'text' | 'pdf') => {
    const notesToExport = exportType === 'current' && selectedNote ? [selectedNote] : notes;
    
    if (notesToExport.length === 0) {
      toast.error('No notes to export');
      return;
    }

    switch (format) {
      case 'markdown':
        exportAsMarkdown(notesToExport);
        break;
      case 'text':
        exportAsText(notesToExport);
        break;
      case 'pdf':
        exportAsPDF(notesToExport);
        break;
    }
    
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Export Notes
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Export Type Selection */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium">What to export:</h4>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant={exportType === 'current' ? 'default' : 'outline'}
                className="justify-start h-auto p-3"
                onClick={() => setExportType('current')}
                disabled={!selectedNote}
              >
                <div className="text-left">
                  <div className="font-medium">Current Note</div>
                  <div className="text-xs text-muted-foreground">
                    {selectedNote ? selectedNote.title : 'No note selected'}
                  </div>
                </div>
              </Button>
              
              <Button
                variant={exportType === 'all' ? 'default' : 'outline'}
                className="justify-start h-auto p-3"
                onClick={() => setExportType('all')}
              >
                <div className="text-left">
                  <div className="font-medium">All Notes</div>
                  <div className="text-xs text-muted-foreground">
                    {notes.length} notes
                  </div>
                </div>
              </Button>
            </div>
          </div>

          {/* Format Selection */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium">Export format:</h4>
            <div className="grid grid-cols-1 gap-2">
              <Button
                variant="outline"
                className="justify-start gap-3 h-auto p-3"
                onClick={() => handleExport('markdown')}
              >
                <Hash className="h-4 w-4" />
                <div className="text-left">
                  <div className="font-medium">Markdown (.md)</div>
                  <div className="text-xs text-muted-foreground">
                    Preserves formatting, compatible with most editors
                  </div>
                </div>
              </Button>
              
              <Button
                variant="outline"
                className="justify-start gap-3 h-auto p-3"
                onClick={() => handleExport('text')}
              >
                <FileText className="h-4 w-4" />
                <div className="text-left">
                  <div className="font-medium">Plain Text (.txt)</div>
                  <div className="text-xs text-muted-foreground">
                    Simple text format, universally compatible
                  </div>
                </div>
              </Button>
              
              <Button
                variant="outline"
                className="justify-start gap-3 h-auto p-3"
                onClick={() => handleExport('pdf')}
              >
                <File className="h-4 w-4" />
                <div className="text-left">
                  <div className="font-medium">PDF (.pdf)</div>
                  <div className="text-xs text-muted-foreground">
                    Print-ready format, preserves layout
                  </div>
                </div>
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};