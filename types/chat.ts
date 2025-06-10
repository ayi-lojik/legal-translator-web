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
    isUrl: boolean;
}

export interface FileUploadUrl {
    url: string;
    fileName: string;
}
export interface ApiResponse<T> {
    data: T;
}

export interface GetSummaryParams {
    type: 'file' | 'url' | 'text';
    value: string;
}