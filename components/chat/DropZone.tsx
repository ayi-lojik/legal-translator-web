'use client';

import { Upload, FileText } from 'lucide-react';

interface DropZoneProps {
  isDragActive: boolean;
}

export function DropZone({ isDragActive }: DropZoneProps) {
  if (!isDragActive) return null;

  return (
    <div className="absolute inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center">
      <div className="border-2 border-dashed border-primary/50 rounded-2xl p-12 bg-primary/5 text-center max-w-md mx-4">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
          <Upload size={32} className="text-primary" />
        </div>
        
        <h3 className="text-xl font-semibold mb-2">Drop your file here</h3>
        <p className="text-muted-foreground mb-4">
          Release to upload your file to the chat
        </p>
        
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <FileText size={16} />
          <span>Supports images, documents, and more</span>
        </div>
      </div>
    </div>
  );
}