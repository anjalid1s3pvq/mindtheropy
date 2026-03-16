import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { ChatBubble } from "@/components/ChatBubble";
import { InputArea } from "@/components/InputArea";
import bgImage from "@assets/generated_images/deep_emerald_green_and_gold_abstract_3d_background.png";
import { Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Welcome to Serenity. I am here to listen, understand, and walk with you through whatever is on your mind. Would you like to share how you are feeling today?",
      timestamp: new Date(),
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    const initSession = async () => {
      try {
        const response = await fetch("/api/sessions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });
        const session = await response.json();
        setSessionId(session.id);
      } catch (error) {
        console.error("Failed to create session:", error);
        toast({
          title: "Connection Error",
          description: "Could not start a therapy session. Please refresh the page.",
          variant: "destructive",
        });
      }
    };
    
    initSession();
  }, []);

  const handleSend = async (text: string) => {
    if (!sessionId) {
      toast({
        title: "Not Connected",
        description: "Please wait for the session to initialize.",
        variant: "destructive",
      });
      return;
    }

    const newUserMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newUserMessage]);
    setIsTyping(true);

    try {
      const response = await fetch(`/api/sessions/${sessionId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: "user",
          content: text,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      const data = await response.json();
      
      const assistantMessage: Message = {
        id: data.assistantMessage.id,
        role: "assistant",
        content: data.assistantMessage.content,
        timestamp: new Date(data.assistantMessage.timestamp),
      };

      setMessages((prev) => {
        const filtered = prev.filter(m => m.id !== newUserMessage.id);
        return [
          ...filtered,
          {
            ...newUserMessage,
            id: data.userMessage.id,
            timestamp: new Date(data.userMessage.timestamp),
          },
          assistantMessage,
        ];
      });
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Message Failed",
        description: "Could not send your message. Please try again.",
        variant: "destructive",
      });
      setMessages((prev) => prev.filter(m => m.id !== newUserMessage.id));
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-background text-foreground font-sans selection:bg-primary/30">
      <div className="absolute inset-0 z-0">
        <img 
            src={bgImage} 
            alt="Background" 
            className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background/95" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
      </div>

      <div className="relative z-10 flex flex-col h-screen max-w-5xl mx-auto px-4 md:px-6">
        <header className="flex items-center justify-between py-6 border-b border-white/5">
            <div>
                <h1 className="text-2xl md:text-3xl font-display font-medium text-primary tracking-wide">Serenity AI</h1>
                <p className="text-xs text-muted-foreground uppercase tracking-[0.2em] mt-1">Your Personal Sanctuary</p>
            </div>
            <div className="flex items-center gap-4">
                <Link href="/report">
                    <button className="p-2 rounded-full text-muted-foreground hover:text-primary hover:bg-white/5 transition-colors" title="View Project Report">
                        <Info className="w-5 h-5" />
                    </button>
                </Link>
                <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/5">
                    <div className={`w-2 h-2 rounded-full ${sessionId ? 'bg-green-500' : 'bg-yellow-500'} animate-pulse`} />
                    <span className="text-xs text-muted-foreground font-medium">
                        {sessionId ? 'Private Session Active' : 'Connecting...'}
                    </span>
                </div>
            </div>
        </header>

        <main className="flex-1 overflow-y-auto py-6 scrollbar-thin pr-2">
            <div className="space-y-6 pb-4">
                {messages.map((msg) => (
                    <ChatBubble key={msg.id} message={msg} />
                ))}
                
                {isTyping && (
                  <div className="flex w-full justify-start mb-6">
                     <div className="glass-panel px-4 py-3 rounded-2xl rounded-tl-sm flex items-center gap-1">
                        <div className="w-1.5 h-1.5 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                        <div className="w-1.5 h-1.5 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                        <div className="w-1.5 h-1.5 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                     </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
            </div>
        </main>

        <footer className="py-6 pt-2">
            <InputArea onSend={handleSend} />
            <p className="text-center text-[10px] text-muted-foreground mt-4 opacity-60">
                Serenity AI provides supportive conversation but is not a replacement for professional clinical therapy in crisis situations.
            </p>
        </footer>
      </div>
    </div>
  );
}
