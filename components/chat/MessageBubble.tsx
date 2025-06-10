'use client';

import { Message } from '@ayilojik/types/chat';
import { Copy, Bot, User, Download, FileText, Image as IMGICON, Video, Music, Archive } from 'lucide-react';
import { Button } from '@ayilojik/components/ui/button';
import { useState } from 'react';
import { formatFileSize } from '@ayilojik/lib/utils';

interface MessageBubbleProps {
  message: Message;
  isLatest?: boolean;
}

export function MessageBubble({ message, isLatest }: MessageBubbleProps) {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === 'user';

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <IMGICON size={16} />;
    if (type.startsWith('video/')) return <Video size={16} />;
    if (type.startsWith('audio/')) return <Music size={16} />;
    if (type.includes('zip') || type.includes('rar')) return <Archive size={16} />;
    return <FileText size={16} />;
  };

  
  const handleFileDownload = () => {
    if (message.file) {
      const link = document.createElement('a');
      link.href = message.file.url;
      link.download = message.file.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (isUser) {
    return (
      <div
        className={`flex items-start gap-3 p-4 group hover:bg-muted/30 transition-colors duration-200 ${
          isLatest ? 'animate-in slide-in-from-bottom-4 duration-500' : ''
        }`}
      >
        <Button
          variant="ghost"
          size="sm"
          className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          onClick={handleCopy}
        >
          <Copy size={14} />
          <span className="sr-only">
            {copied ? 'Copied!' : 'Copy message'}
          </span>
        </Button>
        
        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-2 justify-end">
            <span className="text-xs text-muted-foreground">
              {message.timestamp.toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </span>
            <span className="text-sm font-medium text-muted-foreground">
              You
            </span>
          </div>
          
          {message.content && (
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <p className="text-foreground leading-7 whitespace-pre-wrap text-right">
                {message.content}
              </p>
            </div>
          )}
          
          {message.file && (
            <div className="flex justify-end">
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg border max-w-sm">
                <div className="flex-shrink-0 w-8 h-8 rounded bg-blue-200 flex items-center justify-center" >
                  {getFileIcon(message.file.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{message.file.name}</p>
                  <p className="text-xs text-muted-foreground">{formatFileSize(message.file.size)}</p>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleFileDownload}
                  className="flex-shrink-0 h-8 w-8 p-0"
                >
                  <Download size={14} />
                </Button>
              </div>
            </div>
          )}
        </div>
        
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
          <User size={16} />
        </div>
      </div>
    );
  }

  // Assistant messages (left-aligned, original layout)
  return (
    <div
      className={`flex items-start gap-3 p-4 group hover:bg-muted/30 transition-colors duration-200 ${
        isLatest ? 'animate-in slide-in-from-bottom-4 duration-500' : ''
      }`}
    >
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-white">
        <Bot size={16} />
      </div>
      
      <div className="flex-1 space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-muted-foreground">
            Assistant
          </span>
          <span className="text-xs text-muted-foreground">
            {message.timestamp.toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </span>
        </div>
        
        {message.file && (
          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg border border-border/50 max-w-sm">
            <div className="flex-shrink-0 w-8 h-8 rounded bg-primary/10 flex items-center justify-center text-primary">
              {getFileIcon(message.file.type)}
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{message.file.name}</p>
              <p className="text-xs text-muted-foreground">{formatFileSize(message.file.size)}</p>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleFileDownload}
              className="flex-shrink-0 h-8 w-8 p-0"
            >
              <Download size={14} />
            </Button>
          </div>
        )}
        
        {message.content && (
          <div className="prose prose-sm max-w-none dark:prose-invert">
            <p className="text-foreground leading-7 whitespace-pre-wrap">
              {message.content}
            </p>
          </div>
        )}
      </div>
      
      <Button
        variant="ghost"
        size="sm"
        className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        onClick={handleCopy}
      >
        <Copy size={14} />
        <span className="sr-only">
          {copied ? 'Copied!' : 'Copy message'}
        </span>
      </Button>
    </div>
  );
}