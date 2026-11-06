import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { sound } from '../utils/audio';
import {
  Bot,
  Send,
  Volume2,
  Sparkles,
  BookOpen,
  Calculator,
  RotateCcw,
  User,
  HelpCircle,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  isAudioPlaying?: boolean;
}

export const ChatbotView: React.FC = () => {
  const { currentStudent } = useApp();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: `Xin chào ${currentStudent?.name || 'bạn nhỏ'}! 🤖 Mình là Bạn Học AI – Trợ lý tri thức lớp 2 của trường TH-THCS Vĩnh Điều. Em cần mình hỗ trợ bài học nào môn Toán hay Tiếng Việt hôm nay nè?`,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [inputPrompt, setInputPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const quickPrompts = [
    'Bạn ơi, em chưa hiểu phép cộng qua 10.',
    'Cho em bài luyện tập Toán về đơn vị lít.',
    'Từ chỉ đặc điểm là gì vậy bạn?',
    'Làm sao để nhớ bảng nhân 2 thật nhanh?',
    'Khi nào thì viết chữ c, khi nào viết k?',
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputPrompt).trim();
    if (!text || isLoading) return;

    sound.playClick();
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputPrompt('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          currentStudentName: currentStudent?.name || 'Em học sinh',
        }),
      });

      const data = await response.json();
      const replyText =
        data.reply ||
        'Mình đã ghi nhận câu hỏi của em! Hãy luyện tập thêm các bài tập trong thư viện nhé!';

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: replyText,
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
      sound.playCorrect();
    } catch (err) {
      console.error('Chatbot error:', err);
      const fallbackAiMsg: ChatMessage = {
        id: `ai-err-${Date.now()}`,
        sender: 'ai',
        text: `Chào em! Mình luôn ở đây để giúp em học tốt Toán và Tiếng Việt lớp 2. Em hãy thử mở mục Kho bài tập để làm các bài toán thú vị nhé!`,
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackAiMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  // Text to Speech for kids (native Web Speech API)
  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'vi-VN';
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      {/* Chatbot Header */}
      <div className="rounded-3xl bg-gradient-to-r from-cyan-600 via-teal-600 to-blue-700 text-white p-6 sm:p-8 shadow-lg border-2 border-cyan-300">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur text-white flex items-center justify-center font-black text-3xl shadow-inner animate-bounce">
              🤖
            </div>
            <div>
              <span className="bg-amber-300 text-cyan-950 text-xs font-black px-2.5 py-0.5 rounded-full uppercase">
                Trợ lý tri thức lớp 2
              </span>
              <h1 className="text-2xl sm:text-3xl font-black mt-1">BẠN HỌC AI – ĐỒNG HÀNH 24/7</h1>
              <p className="text-xs sm:text-sm text-cyan-100 max-w-xl mt-1">
                Gợi ý từng bước học Toán &amp; Tiếng Việt SGK Kết nối tri thức với cuộc sống. Lắng nghe, giải thích
                và cổ vũ học sinh tự khám phá kiến thức!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Chat Interface */}
      <div className="bg-white rounded-3xl border-2 border-cyan-200 shadow-sm overflow-hidden flex flex-col h-[600px]">
        {/* Messages List Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-gradient-to-b from-cyan-50/20 to-white">
          {messages.map((m) => {
            const isAi = m.sender === 'ai';
            return (
              <div
                key={m.id}
                className={`flex gap-3 max-w-[85%] sm:max-w-[75%] ${
                  isAi ? 'mr-auto' : 'ml-auto flex-row-reverse'
                }`}
              >
                {/* Avatar */}
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm shrink-0 shadow-sm ${
                    isAi
                      ? 'bg-gradient-to-tr from-cyan-500 to-blue-600 text-white'
                      : 'bg-amber-200 text-amber-900'
                  }`}
                >
                  {isAi ? '🤖' : currentStudent?.avatar || '👦'}
                </div>

                {/* Message Bubble */}
                <div
                  className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-xs ${
                    isAi
                      ? 'bg-white border-2 border-cyan-100 text-slate-800 rounded-tl-none'
                      : 'bg-gradient-to-r from-red-600 to-amber-600 text-white rounded-tr-none font-semibold'
                  }`}
                >
                  <p className="whitespace-pre-line">{m.text}</p>

                  <div className="mt-2 flex items-center justify-between gap-2 text-[10px] text-slate-400">
                    <span>{m.timestamp}</span>
                    {isAi && (
                      <button
                        onClick={() => speakText(m.text)}
                        title="Nghe Bạn Học AI đọc lời thoại"
                        className="p-1 rounded hover:bg-cyan-50 text-cyan-600 transition-colors flex items-center gap-1"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>Đọc cho em nghe</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-3 max-w-[75%] mr-auto items-center">
              <div className="w-9 h-9 rounded-full bg-cyan-600 text-white flex items-center justify-center font-bold text-sm shadow-sm animate-pulse">
                🤖
              </div>
              <div className="p-3 bg-white border border-cyan-200 rounded-2xl text-xs text-slate-500 italic flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-600 animate-ping"></span>
                Bạn Học AI đang suy nghĩ câu trả lời cho em...
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Prompts */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 overflow-x-auto flex gap-2">
          {quickPrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(p)}
              className="px-3 py-1.5 rounded-full bg-white hover:bg-cyan-50 text-slate-700 hover:text-cyan-800 text-xs font-semibold whitespace-nowrap border border-slate-200 hover:border-cyan-300 transition-colors shadow-2xs shrink-0"
            >
              💬 {p}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 bg-white border-t border-slate-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              placeholder="Nhập câu hỏi hoặc kiến thức em chưa hiểu ở đây..."
              className="flex-1 px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-cyan-500 font-semibold text-xs sm:text-sm text-slate-800"
            />
            <button
              type="submit"
              disabled={!inputPrompt.trim() || isLoading}
              className="px-5 py-3 rounded-2xl bg-cyan-600 hover:bg-cyan-700 disabled:opacity-40 text-white font-bold text-sm shadow transition-colors flex items-center gap-1.5 shrink-0"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Gửi hỏi</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
