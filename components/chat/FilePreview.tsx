'use client';

import { X, FileText, Image, Video, Music, Archive } from 'lucide-react';
import { Button } from '@ayilojik/components/ui/button';
import { formatFileSize } from '@ayilojik/lib/utils';

interface FilePreviewProps {
  file: File;
  onRemove: () => void;
}

export function FilePreview({ file, onRemove }: FilePreviewProps) {
  console.log('FilePreview', file);

  const getFileIcon = (type: string) => {
    return <FileText size={16} />;
  };



  return (
    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg border">
      <div className="flex-shrink-0 w-8 h-8 rounded flex items-center justify-center text-primary">
        {getFileIcon(file.type)}
      </div>
      
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{file.name}</p>
        <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
      </div>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={onRemove}
        className="flex-shrink-0 h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
      >
        <X size={14} />
      </Button>
    </div>
  );
}