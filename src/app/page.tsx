'use client';

import { useState } from 'react';
import { useChat } from '@ai-sdk/react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SendIcon, UserIcon, BotIcon, TerminalIcon } from 'lucide-react';

export default function Chat() {
  const [inputValue, setInputValue] = useState('');
  const { messages, sendMessage, status, error } = useChat();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim() || status === 'streaming') return;
    
    sendMessage({
      parts: [
        { type: 'text', text: inputValue }
      ]
    });
    setInputValue('');
  };

  const isStreaming = status === 'streaming';

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-stone-50 dark:bg-stone-950/50">
      <Card className="w-full max-w-2xl h-[85vh] flex flex-col shadow-2xl border-stone-200/50 dark:border-stone-800/50 bg-white/80 dark:bg-stone-900/80 backdrop-blur-md">
        <CardHeader className="border-b border-stone-100 dark:border-stone-800 px-6 py-4 bg-stone-50/50 dark:bg-stone-900/50">
          <CardTitle className="flex items-center gap-3 text-xl font-bold tracking-tight text-stone-800 dark:text-stone-100">
            <div className="w-10 h-10 rounded-xl bg-stone-900 dark:bg-stone-100 flex items-center justify-center shadow-lg shadow-stone-200 dark:shadow-none rotate-2">
              <TerminalIcon className="w-6 h-6 text-white dark:text-stone-900" />
            </div>
            <div className="flex flex-col">
              <span>Kopiiki Code</span>
              <span className="text-[10px] font-medium text-stone-400 uppercase tracking-widest flex items-center gap-1">
                <span className={`w-1.5 h-1.5 rounded-full ${isStreaming ? 'bg-emerald-500 animate-pulse' : 'bg-stone-400'}`} />
                {isStreaming ? 'Agent Thinking...' : 'Ready'}
              </span>
            </div>
          </CardTitle>
        </CardHeader>

        <CardContent className="flex-1 p-0 overflow-hidden bg-stone-50/20 dark:bg-stone-950/20">
          <ScrollArea className="h-full px-6 py-6">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-6 py-32 animate-in fade-in zoom-in duration-500">
                <div className="w-20 h-20 rounded-[2rem] bg-stone-100 dark:bg-stone-800 flex items-center justify-center rotate-6 scale-110 shadow-inner">
                   <BotIcon className="w-10 h-10 text-stone-400" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-stone-800 dark:text-stone-200">欢迎来到 Kopiiki Code</h3>
                  <p className="text-stone-500 dark:text-stone-400 max-w-sm mx-auto text-sm leading-relaxed text-balance">
                    你的新一代 AI 编程助手。支持多模态交互与结构化推理。
                  </p>
                </div>
              </div>
            )}
            
            <div className="space-y-8">
              {error && (
                <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 text-red-600 dark:text-red-400 text-xs flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
                   <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                   <strong>Error:</strong> {error.message}
                </div>
              )}

              {messages.map((m) => (
                <div key={m.id} className={`flex gap-4 ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}>
                  {m.role !== 'user' && (
                    <div className="w-9 h-9 rounded-xl bg-stone-100 dark:bg-stone-800 flex-shrink-0 flex items-center justify-center mt-0.5 border border-stone-200/50 dark:border-stone-700/50">
                      <BotIcon className="w-5 h-5 text-stone-600 dark:text-stone-300" />
                    </div>
                  )}
                  
                  <div className={`max-w-[88%] rounded-2xl px-5 py-3.5 text-sm shadow-sm transition-all ${
                    m.role === 'user' 
                      ? 'bg-stone-900 border-stone-800 text-stone-50 rounded-tr-none' 
                      : 'bg-white dark:bg-stone-900 border border-stone-100 dark:border-stone-800 text-stone-800 dark:text-stone-100 rounded-tl-none'
                  }`}>
                    <div className="prose prose-stone dark:prose-invert max-w-none prose-sm prose-p:leading-relaxed prose-pre:p-0 prose-pre:bg-transparent">
                      {m.parts.map((part, i) => {
                        if (part.type === 'text') {
                          return (
                            <ReactMarkdown 
                              key={i}
                              remarkPlugins={[remarkGfm]}
                              components={{
                                code({ node, className, children, ...props }) {
                                  const match = /language-(\w+)/.exec(className || '');
                                  const isInline = !match;
                                  return isInline ? (
                                    <code className="bg-stone-100 dark:bg-stone-800 px-1.5 py-0.5 rounded text-stone-600 dark:text-stone-300 font-medium" {...props}>
                                      {children}
                                    </code>
                                  ) : (
                                    <div className="my-4 rounded-xl overflow-hidden border border-stone-200 dark:border-stone-700 bg-stone-950 shadow-md">
                                      <div className="flex items-center justify-between px-4 py-2 bg-stone-900 border-b border-stone-800">
                                        <span className="text-[10px] font-bold text-stone-500 uppercase tracking-widest">{match[1]}</span>
                                      </div>
                                      <pre className="p-4 overflow-x-auto text-[13px] leading-relaxed text-stone-300 scrollbar-thin scrollbar-thumb-stone-800">
                                        <code className={className} {...props}>{children}</code>
                                      </pre>
                                    </div>
                                  );
                                }
                              }}
                            >
                              {part.text}
                            </ReactMarkdown>
                          );
                        }
                        
                        if (part.type === 'reasoning') {
                          return (
                            <div key={i} className="mb-4 p-3 bg-stone-50 dark:bg-stone-800/50 border-l-2 border-stone-300 dark:border-stone-600 rounded-r-lg italic text-stone-500 dark:text-stone-400 text-[13px] leading-relaxed">
                              <div className="flex items-center gap-2 mb-1 not-italic font-bold text-[10px] uppercase tracking-wider opacity-50">
                                <TerminalIcon className="w-3 h-3" />
                                Thinking Process
                              </div>
                              {part.text}
                            </div>
                          );
                        }

                        // Catch-all for other types or debugging
                        return (
                          <div key={i} className="text-[10px] text-stone-400 font-mono mt-1 opacity-50">
                            [{part.type} part content]
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {m.role === 'user' && (
                    <div className="w-9 h-9 rounded-xl bg-stone-900 dark:bg-stone-800 flex-shrink-0 flex items-center justify-center mt-0.5 border border-stone-800 dark:border-stone-700 shadow-md">
                      <UserIcon className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
              ))}
              
              {isStreaming && (
                <div className="flex gap-4 justify-start animate-in fade-in duration-300">
                  <div className="w-9 h-9 rounded-xl bg-stone-100 dark:bg-stone-800 flex-shrink-0 flex items-center justify-center mt-0.5 animate-pulse">
                    <BotIcon className="w-5 h-5 text-stone-400" />
                  </div>
                  <div className="bg-white dark:bg-stone-900 border border-stone-100 dark:border-stone-800 rounded-2xl rounded-tl-none px-5 py-3.5 flex items-center gap-1.5 h-11">
                    <span className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce"></span>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>

        <CardFooter className="p-5 border-t border-stone-100 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/50">
          <form onSubmit={handleSubmit} className="flex w-full items-end gap-3">
            <div className="flex-1 relative group">
              <Input
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                    handleSubmit();
                  }
                }}
                placeholder="在此输入代码或问题..."
                className="w-full bg-white dark:bg-stone-950 border-stone-200 dark:border-stone-800 focus-visible:ring-stone-400 rounded-2xl min-h-[52px] py-4 shadow-sm transition-all group-focus-within:shadow-md"
                disabled={isStreaming}
              />
              <div className="absolute right-3 bottom-3 text-[10px] text-stone-400 font-mono opacity-0 group-focus-within:opacity-100 transition-opacity">
                CMD + ENTER
              </div>
            </div>
            <Button 
              type="submit" 
              disabled={isStreaming || !inputValue.trim()}
              className="bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:hover:bg-stone-200 dark:text-stone-900 rounded-2xl h-[52px] px-6 transition-all active:scale-95 shadow-lg shadow-stone-200 dark:shadow-none"
            >
              <SendIcon className="w-5 h-5" />
            </Button>
          </form>
        </CardFooter>
      </Card>
      
      <p className="mt-6 text-[10px] text-stone-400 uppercase tracking-[0.2em] font-medium text-center opacity-80 font-mono">
        Kopiiki Engine • Vercel AI SDK v6 Powered
      </p>
    </main>
  );
}
