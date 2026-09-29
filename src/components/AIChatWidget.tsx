import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Sparkles, Bot, User, RefreshCw, AlertCircle, Minimize2, Maximize2 } from 'lucide-react';
import { Item } from '../types';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: number;
  isError?: boolean;
}

interface AIChatWidgetProps {
  items: Item[];
}

const DEFAULT_WEBHOOK_URL = 'https://sahitya14.app.n8n.cloud/webhook/90ed1ff1-fb74-441e-832e-f232bc140e03/chat';
const STORAGE_CHAT_KEY = 'campus_ai_chat_history_v1';
const STORAGE_SESSION_KEY = 'campus_ai_chat_session_id';

export const AIChatWidget: React.FC<AIChatWidgetProps> = ({ items }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState(DEFAULT_WEBHOOK_URL);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string>('');
  const [showConfig, setShowConfig] = useState(false);

  const [messages, setMessages] = useState<Message[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_CHAT_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to parse chat history', e);
    }
    return [
      {
        id: 'msg-welcome',
        sender: 'assistant',
        text: 'Hi there! I am your Campus Lost & Found AI Assistant. Ask me anything about reported items, drop-off locations, or finding your lost belongings on campus.',
        timestamp: Date.now(),
      },
    ];
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize or load session ID
  useEffect(() => {
    let sid = localStorage.getItem(STORAGE_SESSION_KEY);
    if (!sid) {
      sid = 'session_' + Math.random().toString(36).substring(2, 11);
      localStorage.setItem(STORAGE_SESSION_KEY, sid);
    }
    setSessionId(sid);
  }, []);

  // Save chat history
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_CHAT_KEY, JSON.stringify(messages));
    } catch (e) {
      console.warn('Failed to save chat history', e);
    }
  }, [messages]);

  // Scroll to bottom when messages update
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isLoading]);

  const handleSendMessage = async (customText?: string) => {
    const textToSend = (customText || inputMessage).trim();
    if (!textToSend || isLoading) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Summary of recent items for context
      const campusContext = items.slice(0, 10).map((i) => ({
        type: i.type,
        name: i.name,
        category: i.category,
        location: i.location,
        status: i.status,
      }));

      // Standard n8n AI chat webhook payload
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          chatInput: textToSend,
          message: textToSend,
          sessionId: sessionId || 'default_session',
          context: {
            activeReportsCount: items.length,
            recentItems: campusContext,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`Server responded with HTTP ${response.status} (${response.statusText})`);
      }

      const contentType = response.headers.get('content-type') || '';
      let replyText = '';

      if (contentType.includes('application/json')) {
        const data = await response.json();
        replyText =
          data.output ||
          data.response ||
          data.text ||
          data.message ||
          (typeof data === 'string' ? data : JSON.stringify(data));
      } else {
        replyText = await response.text();
      }

      if (!replyText || typeof replyText !== 'string') {
        replyText = 'I received your inquiry and checked the campus database. How else can I assist?';
      }

      const assistantMsg: Message = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: replyText,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      console.error('Webhook error:', err);
      const errorMsg: Message = {
        id: `err-${Date.now()}`,
        sender: 'assistant',
        text: `Couldn't reach the n8n AI webhook (${err.message || 'Network error'}). Make sure the workflow is active in your n8n workspace.`,
        timestamp: Date.now(),
        isError: true,
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = () => {
    const welcomeMsg: Message = {
      id: `msg-${Date.now()}`,
      sender: 'assistant',
      text: 'Chat history cleared. How can I help you today?',
      timestamp: Date.now(),
    };
    setMessages([welcomeMsg]);
    localStorage.removeItem(STORAGE_CHAT_KEY);
    const newSid = 'session_' + Math.random().toString(36).substring(2, 11);
    setSessionId(newSid);
    localStorage.setItem(STORAGE_SESSION_KEY, newSid);
  };

  const SUGGESTED_PROMPTS = [
    'Did anyone find Apple AirPods?',
    'Where is the Student Union lost & found desk?',
    'What do I do if I lost my keys?',
  ];

  return (
    <>
      {/* Floating Launcher Trigger */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all cursor-pointer group active:scale-95"
          aria-label="Open Lost & Found AI Assistant"
        >
          <div className="relative">
            <Sparkles className="w-5 h-5 text-sky-200" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-blue-600 animate-pulse" />
          </div>
          <span className="text-xs font-semibold tracking-wide pr-1">
            Ask Lost & Found AI
          </span>
        </button>
      )}

      {/* Floating Chat Modal */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[92vw] sm:w-[400px] h-[550px] max-h-[85vh] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="px-4 py-3 bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-700/80 border border-blue-500/40 flex items-center justify-center">
                <Bot className="w-4 h-4 text-sky-200" />
              </div>
              <div>
                <h3 className="text-xs font-bold leading-none flex items-center gap-1.5">
                  <span>Campus AI Assistant</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                </h3>
                <span className="text-[10px] text-blue-200">
                  Powered by n8n Workflow
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleClearHistory}
                title="Reset conversation"
                className="p-1.5 text-blue-200 hover:text-white hover:bg-blue-800 rounded-md transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Close chat"
                className="p-1.5 text-blue-200 hover:text-white hover:bg-blue-800 rounded-md transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Configuration Banner (Optional Webhook display) */}
          <div className="px-3 py-1.5 bg-blue-50/80 border-b border-blue-100 flex items-center justify-between text-[11px] text-blue-900">
            <span className="truncate max-w-[280px]">
              Webhook: <span className="font-mono text-[10px] text-blue-700">...{webhookUrl.slice(-25)}</span>
            </span>
            <button
              onClick={() => setShowConfig(!showConfig)}
              className="text-[10px] text-blue-600 hover:underline font-semibold"
            >
              {showConfig ? 'Hide' : 'Edit'}
            </button>
          </div>

          {showConfig && (
            <div className="p-3 bg-slate-50 border-b border-slate-200 space-y-2 text-xs">
              <label className="block text-[11px] font-semibold text-slate-700">
                n8n Webhook Endpoint URL:
              </label>
              <input
                type="url"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                placeholder="https://...app.n8n.cloud/webhook/.../chat"
                className="w-full px-2 py-1.5 bg-white border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 outline-hidden font-mono"
              />
              <p className="text-[10px] text-slate-500">
                Ensure this webhook URL has CORS enabled or accepts requests from web applications.
              </p>
            </div>
          )}

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50 text-xs">
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-2 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-[10px] ${
                      isUser
                        ? 'bg-blue-600 text-white'
                        : msg.isError
                        ? 'bg-rose-100 text-rose-600 border border-rose-200'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {isUser ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                  </div>

                  <div
                    className={`max-w-[80%] rounded-2xl px-3.5 py-2 leading-relaxed text-xs shadow-2xs ${
                      isUser
                        ? 'bg-blue-600 text-white rounded-tr-xs'
                        : msg.isError
                        ? 'bg-rose-50 text-rose-800 border border-rose-200 rounded-tl-xs'
                        : 'bg-white text-slate-800 border border-slate-200 rounded-tl-xs'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                    <span
                      className={`block text-[9px] mt-1 ${
                        isUser ? 'text-blue-200 text-right' : 'text-slate-400'
                      }`}
                    >
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              );
            })}

            {isLoading && (
              <div className="flex items-start gap-2">
                <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center shrink-0">
                  <Bot className="w-3.5 h-3.5" />
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-xs px-3.5 py-2.5 text-slate-500 shadow-2xs flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestion Chips */}
          <div className="px-3 py-1.5 bg-white border-t border-slate-100 flex gap-1.5 overflow-x-auto no-scrollbar">
            {SUGGESTED_PROMPTS.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(prompt)}
                disabled={isLoading}
                className="whitespace-nowrap text-[11px] px-2.5 py-1 bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-600 rounded-full transition-colors shrink-0 disabled:opacity-50"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Message Input Footer */}
          <div className="p-3 bg-white border-t border-slate-200">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask about a lost item or campus spot..."
                disabled={isLoading}
                className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-hidden"
              />
              <button
                type="submit"
                disabled={!inputMessage.trim() || isLoading}
                className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl disabled:opacity-40 transition-colors shadow-2xs cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
