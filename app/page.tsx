"use client";

import {
  Scale,
  Sparkles
} from 'lucide-react';
import { ChatInterface } from '@ayilojik/components/chat/ChatInterface';

export default function LegalDocumentSummarizer() {


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <div className="container mx-auto px-4 py-2 max-w-full sm:max-w-2xl lg:max-w-3xl xl:max-w-6xl">
        {/* Header */}
        <div className="text-center mb-4">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="p-3 bg-blue-600 rounded-xl">
              <Scale className="h-6 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">Legal AI Summarizer</h1>
            <Sparkles className="h-6 w-8 text-blue-600" />
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Transform complex legal documents into clear, concise summaries using advanced AI technology
          </p>
        </div>

        {/* Main Card */}
        <ChatInterface />
        {/* Footer */}
        <div className="text-center mt-4 text-gray-500">
          <p className="text-sm">
            AI-powered legal document analysis • Secure and confidential processing
          </p>
        </div>
      </div>
    </div>
  );
}