'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { XMarkIcon, PaperClipIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline';

interface LiveChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Message = {
  id: string;
  sender: 'cs' | 'user';
  text: string;
  time: string;
};

// Simulated mock username for the demo
const customerName = 'Eysa';

export default function LiveChatModal({ isOpen, onClose }: LiveChatModalProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'cs',
      text: `Halo ${customerName}! Ada yang bisa kami bantu terkait paket Anda?`,
      time: getCurrentTime(),
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Reset chat when modal is closed (optional, keeps it fresh for demo purposes)
  useEffect(() => {
    if (!isOpen) {
      setMessages([
        {
          id: '1',
          sender: 'cs',
          text: `Halo ${customerName}! Ada yang bisa kami bantu terkait paket Anda?`,
          time: getCurrentTime(),
        }
      ]);
      setInputValue('');
      setIsTyping(false);
    }
  }, [isOpen]);

  function getCurrentTime() {
    const now = new Date();
    return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  }

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputValue.trim()) return;

    // Add user message
    const newUserMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: inputValue,
      time: getCurrentTime(),
    };
    
    setMessages((prev) => [...prev, newUserMsg]);
    setInputValue('');
    setIsTyping(true);

    // Simulate CS typing and replying
    setTimeout(() => {
      setIsTyping(false);
      const newCsMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'cs',
        text: 'Baik, mohon tunggu sebentar ya. Saya akan segera melakukan pengecekan pada sistem kami sesuai dengan informasi yang Anda berikan.',
        time: getCurrentTime(),
      };
      setMessages((prev) => [...prev, newCsMsg]);
    }, 2500); // 2.5 seconds typing delay
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Blurred Backdrop */}
      <div 
        className="absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-[420px] bg-white rounded-[32px] shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-[#1db372] p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 bg-black/20 rounded-full flex items-center justify-center overflow-hidden border border-white/20">
                 <Image src="/logo1.jpeg" alt="CS Avatar" width={40} height={40} className="object-cover opacity-80" />
              </div>
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#34d399] border-2 border-[#1db372] rounded-full"></div>
            </div>
            <div>
              <h3 className="text-white font-bold text-[15px] leading-tight">Customer Service</h3>
              <div className="flex items-center gap-1.5 mt-0.5">
                <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                <span className="text-emerald-50 text-[11px] font-medium">Aktif Sekarang</span>
              </div>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-emerald-50 hover:text-white p-1 rounded-full hover:bg-black/10 transition-colors"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Chat Body */}
        <div className="flex-1 bg-white p-5 overflow-y-auto h-[360px] max-h-[60vh] flex flex-col gap-4">
          
          <div className="flex justify-center mb-2">
            <span className="bg-[#eaf4ef] text-[#1db372] text-[10px] font-extrabold uppercase tracking-widest px-4 py-1.5 rounded-full">
              HARI INI
            </span>
          </div>

          {messages.map((msg) => {
            if (msg.sender === 'cs') {
              return (
                <div key={msg.id} className="flex items-start gap-2.5 animate-in fade-in slide-in-from-bottom-2">
                  <div className="w-7 h-7 bg-gray-800 rounded-full flex-shrink-0 mt-1 overflow-hidden">
                     <Image src="/logo1.jpeg" alt="CS Avatar" width={28} height={28} className="object-cover opacity-50 grayscale" />
                  </div>
                  <div>
                    <div className="bg-white border border-gray-100 shadow-sm rounded-2xl rounded-tl-sm p-4 text-[13px] text-gray-700 leading-relaxed max-w-[280px]">
                      {msg.text}
                    </div>
                    <p className="text-[10px] text-gray-400 mt-1.5 ml-1">{msg.time}</p>
                  </div>
                </div>
              );
            } else {
              return (
                <div key={msg.id} className="flex flex-col items-end mt-2 animate-in fade-in slide-in-from-bottom-2">
                  <div className="bg-[#0c5132] text-white rounded-2xl rounded-tr-sm p-4 text-[13px] leading-relaxed max-w-[280px] shadow-sm whitespace-pre-wrap">
                    {msg.text}
                  </div>
                  <div className="flex items-center gap-1 mt-1.5 mr-1">
                    <p className="text-[10px] text-gray-400">{msg.time}</p>
                    {/* Double checkmark simulation */}
                    <svg className="w-3.5 h-3.5 text-[#1db372]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
              );
            }
          })}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex items-center gap-2 mt-2 ml-1 animate-in fade-in">
              <div className="bg-white border border-gray-100 shadow-sm rounded-full px-3 py-1.5 flex items-center gap-1 h-8">
                <div className="w-1.5 h-1.5 bg-[#1db372] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-1.5 h-1.5 bg-[#1db372] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-1.5 h-1.5 bg-[#1db372] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
              <span className="text-[10px] font-extrabold text-[#1db372] uppercase tracking-wider">CS SEDANG MENGETIK...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input */}
        <div className="p-4 bg-white border-t border-gray-50/50 shadow-[0_-4px_20px_rgb(0,0,0,0.02)] relative z-10">
          <form onSubmit={handleSendMessage} className="flex items-center bg-[#f4fcf7] border border-emerald-100 rounded-full p-1.5 pl-4">
            <button type="button" className="text-[#1db372] p-1.5 hover:bg-emerald-100 rounded-full transition-colors mr-1">
              <PaperClipIcon className="w-5 h-5" />
            </button>
            <input 
              type="text" 
              placeholder="Tulis pesan..." 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none focus:ring-0 text-[13px] text-gray-800 placeholder-gray-400"
              autoFocus
            />
            <button 
              type="submit"
              disabled={!inputValue.trim() || isTyping}
              className="bg-[#1db372] disabled:bg-gray-300 disabled:cursor-not-allowed text-white w-9 h-9 rounded-full flex items-center justify-center shadow-md hover:bg-[#159a58] transition-colors flex-shrink-0 ml-2"
            >
              <PaperAirplaneIcon className="w-4 h-4 ml-0.5" />
            </button>
          </form>
          <p className="text-center text-[10px] text-gray-400 font-medium mt-3 pb-1">
            Layanan chat ini tersedia 24/7
          </p>
        </div>

      </div>
    </div>
  );
}
