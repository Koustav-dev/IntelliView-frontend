import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { aiAPI } from '../lib/api';
import { useAuthStore } from '../stores/authStore';
import { Brain, Send, User, Bot, Loader2, Sparkles, Code2, Copy, Check } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { cn } from '../lib/utils';
import toast from 'react-hot-toast';

export default function AIChat() {
  const user = useAuthStore(s => s.user);
  const [messages, setMessages] = useState<{role: 'user'|'assistant', content: string}[]>([
    { role: 'assistant', content: `Hi ${user?.fullName?.split(' ')[0] || 'there'}! I'm your IntelliView AI Coach. Ask me anything about Data Structures, Algorithms, System Design, or interview prep!` }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  useEffect(() => { scrollToBottom(); }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    try {
      const { data } = await aiAPI.chat({ message: userMsg });
      setMessages(prev => [...prev, { role: 'assistant', content: data.data }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: "I'm having trouble connecting right now. Please try again later." }]);
    } finally {
      setLoading(false);
    }
  };

  const getSystemDesignPlan = async () => {
     setInput("Can you give me a step-by-step master plan to prepare for System Design interviews in 4 weeks?");
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] pt-16 flex flex-col bg-surface-50 dark:bg-surface-900 items-center">
       <div className="w-full max-w-4xl flex-1 flex flex-col pt-8 pb-4 px-4">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-6">
             <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-500 to-accent-500 mx-auto flex items-center justify-center mb-3 shadow-lg shadow-brand-500/20">
                <Brain className="w-6 h-6 text-white" />
             </div>
             <h1 className="text-2xl font-bold font-display">AI <span className="gradient-text">Interview Coach</span></h1>
             <p className="text-zinc-500 text-sm mt-1">Powered by LLaMA 3.3 70B</p>
          </motion.div>

          {/* Quick Prompts */}
          {messages.length === 1 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8 px-4">
               {[
                 { title: 'Explain concept', text: 'Explain Dynamic Programming like I\'m 5', icon: Sparkles },
                 { title: 'System Design', text: 'How do I design a URL shortener?', icon: Brain },
                 { title: 'Study Plan', text: 'Create a 4-week prep plan for Amazon', icon: Target },
               ].map((p, i) => (
                 <button key={i} onClick={() => setInput(p.text)} className="p-4 rounded-xl bg-white dark:bg-surface-800 border border-zinc-200 dark:border-zinc-700 text-left hover:border-brand-400 hover:shadow-md transition-all group">
                    <p.icon className="w-5 h-5 mb-2 text-brand-500 group-hover:scale-110 transition-transform" />
                    <p className="font-semibold text-sm mb-1">{p.title}</p>
                    <p className="text-xs text-zinc-500">"{p.text}"</p>
                 </button>
               ))}
            </motion.div>
          )}

          {/* Chat Container */}
          <div className="flex-1 bg-white dark:bg-surface-850 border border-zinc-200 dark:border-zinc-700 rounded-2xl shadow-sm flex flex-col overflow-hidden">
             
             {/* Messages */}
             <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
                {messages.map((msg, i) => (
                   <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      {msg.role === 'assistant' && (
                         <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center shrink-0 mt-1">
                            <Bot className="w-4 h-4 text-white" />
                         </div>
                      )}
                      
                      <div className={cn('px-5 py-3.5 rounded-2xl max-w-[85%] sm:max-w-[75%]',
                         msg.role === 'user' 
                         ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-tr-sm' 
                         : 'bg-zinc-100 dark:bg-surface-800 text-zinc-800 dark:text-zinc-200 rounded-tl-sm border border-zinc-200 dark:border-zinc-700'
                      )}>
                         {msg.role === 'user' ? (
                            <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                         ) : (
                            <div className="prose prose-sm dark:prose-invert max-w-none prose-p:leading-relaxed prose-pre:bg-zinc-900 prose-pre:text-zinc-100 prose-pre:rounded-xl">
                               <ReactMarkdown>{msg.content}</ReactMarkdown>
                            </div>
                         )}
                      </div>

                      {msg.role === 'user' && (
                         <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center shrink-0 mt-1 border border-zinc-300 dark:border-zinc-700">
                            <User className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
                         </div>
                      )}
                   </motion.div>
                ))}
                
                {loading && (
                   <div className="flex gap-4 justify-start">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center shrink-0 mt-1">
                         <Bot className="w-4 h-4 text-white" />
                      </div>
                      <div className="px-5 py-4 rounded-2xl bg-zinc-100 dark:bg-surface-800 rounded-tl-sm border border-zinc-200 dark:border-zinc-700 flex items-center gap-2">
                         <div className="w-2 h-2 rounded-full bg-brand-500 animate-bounce" />
                         <div className="w-2 h-2 rounded-full bg-brand-500 animate-bounce [animation-delay:0.2s]" />
                         <div className="w-2 h-2 rounded-full bg-brand-500 animate-bounce [animation-delay:0.4s]" />
                      </div>
                   </div>
                )}
                <div ref={messagesEndRef} />
             </div>

             {/* Input */}
             <div className="p-4 bg-white dark:bg-surface-850 border-t border-zinc-200 dark:border-zinc-700">
                <form onSubmit={handleSubmit} className="relative flex items-end gap-2">
                   <textarea value={input} onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => {
                         if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit(e); }
                      }}
                      placeholder="Ask anything about coding interviews..."
                      className="w-full bg-zinc-50 dark:bg-surface-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3.5 pr-14 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-brand-500/40"
                      rows={1}
                      style={{ minHeight: '52px', maxHeight: '120px' }}
                   />
                   <button type="submit" disabled={!input.trim() || loading}
                      className="absolute right-2 bottom-2 p-2.5 rounded-lg bg-brand-600 hover:bg-brand-700 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                      <Send className="w-4 h-4" />
                   </button>
                </form>
                <div className="text-center mt-3">
                   <p className="text-[10px] text-zinc-400">AI can make mistakes. Verify critical logic before interviews.</p>
                </div>
             </div>
          </div>
       </div>
    </div>
  );
}

// Ensure Target icon is mapped in imports
import { Target } from 'lucide-react';
