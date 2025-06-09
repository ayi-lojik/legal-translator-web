'use client';

import { useState, useRef, useEffect } from 'react';
import { Message, HandleMessageParams } from '@ayilojik/types/chat';
import { MessageBubble } from './MessageBubble';
import { ChatInput } from './ChatInput';
import { TypingIndicator } from './TypingIndicator';
import { DropZone } from './DropZone';
import { Button } from '@ayilojik/components/ui/button';
import { ScrollArea } from '@ayilojik/components/ui/scroll-area';
import { Trash2 } from 'lucide-react';
import { API_BASE_URL } from '@ayilojik/lib/cosntants';
import { hashString, validateFile } from '@ayilojik/lib/utils';


export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello! I'm your AI assistant. How can I help you today? You can also drag and drop files to share them with me.",
      role: 'assistant',
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDragActive, setIsDragActive] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const dragCounter = useRef(0);

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current++;
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragActive(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current--;
    if (dragCounter.current === 0) {
      setIsDragActive(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    dragCounter.current = 0;

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      const file = files[0]; // Handle first file only
      const error = validateFile(file);
      if(error) {
        handleErrorMessage(error);
        return;
      }
      handleSendMessage({ file, isUrl: false });
    }
  };
  const handleErrorMessage = (error: string) => {

    const errorMessage: Message = {
      id: Date.now().toString(),
      content: error,
      role: 'assistant',
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, errorMessage]);
  };

  const getUploadUrl = async (file: File): Promise<any> => {
    const fileHash = await hashString(file.name);
    const fileName = `${fileHash}-${file.name}`;
    return fetch(`${API_BASE_URL}/signurl`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fileName, fileType: file.type }),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to get upload URL');
        }
        return response.json();
      }
    )
    .then(({ data: { url } }: any) => {
        return {
          url,
          fileName,
        };
      })
    .catch(error => {
        throw new Error('Something wrong happened!. Please try again later.');
        
    });
  };

  const uploadFile = async (uploadUrl: string, file: File) => {
    await fetch(uploadUrl, {
                method: 'PUT',
                body: file,
                headers: {
                  'Content-Type': file.type,
                },
          }).then(response => {
            if (!response.ok) {
              throw new Error('Failed to upload file');
            }
          }
    ).catch(error => {
      throw new Error('Failed to upload file. Please try again later.');
    }
    );
  }; 

  const getSummary = ({ type, value }: any) => {
    setIsLoading(true);
    const signal = AbortSignal.timeout(300* 1000); // 5 minutes timeout
    return fetch(`${API_BASE_URL}/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ type, value }),
      signal: signal,
      keepalive: true,
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch summary');
        }
        return response;
      })
      .then(response => response.json())
      .then(({ data }: any) => {
        const summaryMessage: Message = {
          id: Date.now().toString(),
          content: data.summary,
          role: 'assistant',
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, summaryMessage]);
      })
      .catch(error => {
        console.error('Error fetching summary:', error);
        throw new Error('Failed to fetch summary. Please try again later.');
      });
  };

  const sendFileMessage = async (file: File) => {
    const fileUrl = URL.createObjectURL(file);
      const fileData = {
        name: file.name,
        size: file.size,
        type: file.type,
        url: fileUrl,
      };

      const { url, fileName: uploadedFileName } = await getUploadUrl(file);
      await uploadFile(url, file!);
      const userMessage: Message = {
        id: Date.now().toString(),
        content: `Uploaded file: ${file.name}`,
        role: 'user',
        timestamp: new Date(),
        file: fileData,
      };
      setMessages(prev => [...prev, userMessage]);
      await getSummary({ type: 'file', value: uploadedFileName });
  }

  const sendTextContentMessage = async (content: string, isUrl: Boolean) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      role: 'user',
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    await getSummary({ type: isUrl ? 'url' : 'text', value: content });
  };

  const handleSendMessage = async ({ content, file, isUrl } : HandleMessageParams) => {
    try {
      if (file) {
        await sendFileMessage(file);
        return;
      }
      await sendTextContentMessage(content!, isUrl);
    } catch (error) {
      console.error('Error sending message:', error);
      handleErrorMessage(error instanceof Error ? error.message : 'An unexpected error occurred');
    }
    setIsLoading(false);
  };

  const clearChat = () => {
    setMessages([
      {
        id: '1',
        content: "Hello! I'm your AI assistant. How can I help you today? You can also drag and drop files to share them with me.",
        role: 'assistant',
        timestamp: new Date(),
      },
    ]);
  };

  return (
    <div 
      className="flex flex-col h-[700px] max-h-screen bg-blue-50 w-full border relative"
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <DropZone isDragActive={isDragActive} />
      
      {/* Header */}
      <div className="border-b bg-background/80 backdrop-blur-sm px-6 py-4">
        <div className="flex items-center justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={clearChat}
            className="gap-2 hover:bg-destructive hover:text-destructive-foreground transition-colors duration-200"
          >
            <Trash2 size={16} />
            Clear Chat
          </Button>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea ref={scrollAreaRef} className="flex-1">
        <div className="max-w-full mx-auto">
          {messages.map((message, index) => (
            <MessageBubble
              key={message.id}
              message={message}
              isLatest={index === messages.length - 1}
            />
          ))}
          
          {isLoading && <TypingIndicator />}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="max-w-4xl mx-auto w-full">
        <ChatInput onSendMessage={handleSendMessage} onErrorMessage={handleErrorMessage} isLoading={isLoading} />
      </div>
    </div>
  );
}