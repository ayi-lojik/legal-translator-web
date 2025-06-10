'use client';

import { useState } from 'react';
import { Button } from '@ayilojik/components/ui/button';
import { Textarea } from '@ayilojik/components/ui/textarea';
import { Send, Loader2, Paperclip } from 'lucide-react';
import { FilePreview } from './FilePreview';
import { HandleMessageParams } from '@ayilojik/types/chat';
import { validateFile } from '@ayilojik/lib/utils';

interface ChatInputProps {
  onSendMessage: (params: HandleMessageParams) => void;
  onErrorMessage: (message: string,) => void;
  isLoading: boolean;
}

export function ChatInput({ onSendMessage, isLoading, onErrorMessage }: ChatInputProps) {
  const [input, setInput] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const error = validateInput();
    if (!error && !isLoading) {
      onSendMessage({ content: input.trim(), file: selectedFile || undefined, isUrl: isUrl(input.trim())});
      setInput('');
      setSelectedFile(null);
    }
    else {
      onErrorMessage(error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
  };
  
  const isUrl = (url: string) => {
      try {
            new URL(url);
            return true;
      }
      catch (error) {
        console.log(error);
        return false;
    }
  }

  const validateInput = () => {
    
    if (!input.trim() && !selectedFile) {
      return 'Please enter a message or attach a file';
    }

    const inputIsUrl = isUrl(input);
          
    if (!inputIsUrl && !selectedFile) {
      return 'Please enter the document text content or a url to the document';
    }
    if (!inputIsUrl && input.trim().length < 50 && !selectedFile) {
      return 'Document content must be at least 50 characters long';
    }
    
    if (selectedFile) {
      return validateFile(selectedFile);
    }

    return '';
  };

  return (
    <div className="border-t bg-background/80 backdrop-blur-sm">
      <form onSubmit={handleSubmit} className="p-4">
        {selectedFile && (
          <div className="mb-3">
            <FilePreview file={selectedFile} onRemove={removeFile} />
          </div>
        )}
        
        <div className="flex gap-3 items-end">
          <div className="flex-1">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message... (Press Enter to send, Shift+Enter for new line)"
              className="min-h-[60px] max-h-[200px] resize-none focus:ring-2 focus:ring-primary/50 transition-all duration-200"
              disabled={isLoading}
            />
          </div>
          
          <div className="flex gap-2">

            <input
              type="file"
              id="file-upload"
              className="hidden"
              onChange={handleFileSelect}
              disabled={isLoading}
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="h-[60px] w-12"
              onClick={() => document.getElementById('file-upload')?.click()}
              disabled={isLoading}
            >
              <Paperclip size={20} />
              <span className="sr-only">Attach file</span>
            </Button>
            
            <Button
              type="submit"
              disabled={(!input.trim() && !selectedFile) || isLoading}
              className="px-6 h-[60px] bg-blue-500 hover:bg-purple-700 text-white"
            >
              {isLoading ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <Send size={20} />
              )}
              <span className="sr-only">Send message</span>
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}