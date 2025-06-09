'use client';

export function TypingIndicator() {
  return (
    <div className="flex items-start gap-3 p-4 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center">
        <div className="w-4 h-4 rounded-full bg-white animate-pulse" />
      </div>
      
      <div className="flex-1 space-y-1">
        <div className="text-sm font-medium text-muted-foreground">
          Assistant
        </div>
        
        <div className="flex items-center gap-1">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.3s]" />
            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.15s]" />
            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
          </div>
          <span className="text-sm text-muted-foreground ml-2">thinking...</span>
        </div>
      </div>
    </div>
  );
}