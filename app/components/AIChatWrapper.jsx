'use client';

import { useState } from 'react';
import AIChatComponent from '@/app/components/AIChatComponent';
import { AiOutlineClose } from 'react-icons/ai'; // 👈 imported from react-icons

export default function AIChatWrapper() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 bg-indigo-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-indigo-700 transition"
      >
        💬 Chat with AI
      </button>

      {/* Floating Panel */}
      {isOpen && (
        <div className="fixed bottom-20 right-6 z-50 w-full max-w-md bg-white/10 backdrop-blur-xl rounded-xl shadow-2xl border border-white/20 overflow-hidden">
          <div className="flex justify-between items-center p-2 border-b border-white/10 bg-indigo-900 text-white">
            <span className="font-bold">AI Assistant</span>
            <button onClick={() => setIsOpen(false)}>
              <AiOutlineClose className="w-5 h-5 text-white" />
            </button>
          </div>
          <div className="p-3 max-h-[500px] overflow-y-auto">
            <AIChatComponent />
          </div>
        </div>
      )}
    </>
  );
}
