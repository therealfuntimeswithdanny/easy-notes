import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, Pin, PinOff, GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Note {
  id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  pinned: boolean;
  tags: string[];
  category: string;
}

interface SortableItemProps {
  id: string;
  note: Note;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onTogglePin: () => void;
  formatDate: (dateString: string) => string;
  getPreview: (content: string) => string;
}

export const SortableItem = ({
  id,
  note,
  isSelected,
  onSelect,
  onDelete,
  onTogglePin,
  formatDate,
  getPreview,
}: SortableItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group relative rounded-lg cursor-pointer transition-all duration-200",
        "hover:bg-note-hover",
        isSelected && "bg-accent",
        isDragging && "opacity-50 scale-105 shadow-lg z-50"
      )}
    >
      <div className="flex items-start gap-2 p-3">
        {/* Drag Handle */}
        <button
          className="mt-1 p-1 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-4 w-4" />
        </button>

        {/* Note Content */}
        <div className="flex-1 min-w-0" onClick={onSelect}>
          <div className="flex items-center gap-2 mb-1">
            {note.pinned && (
              <Pin className="h-3 w-3 text-primary fill-current" />
            )}
            <h3 className="font-medium text-sm truncate">
              {note.title}
            </h3>
          </div>
          
          {note.tags && note.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {note.tags.slice(0, 3).map(tag => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {note.tags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{note.tags.length - 3}
                </Badge>
              )}
            </div>
          )}
          
          <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
            {getPreview(note.content)}
          </p>
          <p className="text-xs text-muted-foreground">
            {formatDate(note.updated_at)}
          </p>
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 text-muted-foreground hover:text-primary"
            onClick={(e) => {
              e.stopPropagation();
              onTogglePin();
            }}
          >
            {note.pinned ? (
              <PinOff className="h-3 w-3" />
            ) : (
              <Pin className="h-3 w-3" />
            )}
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  );
};