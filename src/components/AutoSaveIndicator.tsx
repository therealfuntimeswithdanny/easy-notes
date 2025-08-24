import { SaveState } from '@/hooks/useAutoSaveIndicator';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AutoSaveIndicatorProps {
  saveState: SaveState;
  className?: string;
}

export const AutoSaveIndicator = ({ saveState, className }: AutoSaveIndicatorProps) => {
  if (saveState === 'idle') return null;

  return (
    <div className={cn("flex items-center gap-2 text-sm", className)}>
      {saveState === 'saving' && (
        <>
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          <span className="text-muted-foreground">Saving...</span>
        </>
      )}
      
      {saveState === 'saved' && (
        <>
          <CheckCircle className="h-4 w-4 text-green-500" />
          <span className="text-green-600">Saved</span>
        </>
      )}
      
      {saveState === 'error' && (
        <>
          <AlertCircle className="h-4 w-4 text-red-500" />
          <span className="text-red-600">Save failed</span>
        </>
      )}
    </div>
  );
};