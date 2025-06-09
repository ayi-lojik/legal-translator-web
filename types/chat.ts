export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  file?: {
    name: string;
    size: number;
    type: string;
    url: string;
  };
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  error?: string;
}

export interface HandleMessageParams {
    content?: string;
    file?: File;
    isUrl: Boolean;
}