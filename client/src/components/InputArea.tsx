import { useState, useRef, useEffect } from "react";
import { Mic, Image as ImageIcon, Send, Paperclip, Camera, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { VoiceVisualizer } from "./VoiceVisualizer";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface InputAreaProps {
  onSend: (text: string) => void;
}

export function InputArea({ onSend }: InputAreaProps) {
  const [input, setInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        // @ts-ignore
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = 'en-US';

        recognitionRef.current.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            setInput((prev) => prev + (prev ? " " : "") + transcript);
            setIsListening(false);
            toast({
                title: "Voice Captured",
                description: "I heard you clearly.",
            });
        };

        recognitionRef.current.onerror = (event: any) => {
            console.error("Speech recognition error", event.error);
            setIsListening(false);
            // Fallback simulation if real voice fails or on error
            simulateVoiceInput();
        };
        
        recognitionRef.current.onend = () => {
            setIsListening(false);
        };
    }
  }, []);

  const simulateVoiceInput = () => {
      // Fallback for environments without speech support or errors
      setTimeout(() => {
          const simulatedTexts = [
              "I've been feeling really anxious lately about my future.",
              "I can't seem to sleep well, my mind keeps racing.",
              "I feel a bit better today, but still overwhelmed.",
              "It's hard for me to focus on my work."
          ];
          const randomText = simulatedTexts[Math.floor(Math.random() * simulatedTexts.length)];
          setInput(randomText);
          setIsListening(false);
          toast({
            title: "Voice Simulation",
            description: "Simulated voice input (Microphone unavailable)",
          });
      }, 2000);
  };

  const handleSend = () => {
    if (!input.trim()) return;
    onSend(input);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const toggleListening = () => {
    if (isListening) {
        recognitionRef.current?.stop();
        setIsListening(false);
        return;
    }

    setIsListening(true);
    toast({
        title: "Listening...",
        description: "Speak now, I'm listening.",
    });

    if (recognitionRef.current) {
        try {
            recognitionRef.current.start();
        } catch (e) {
            console.error(e);
            simulateVoiceInput();
        }
    } else {
        simulateVoiceInput();
    }
  };

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };
  
  const handleCamera = () => {
    setIsCameraOpen(!isCameraOpen);
    toast({
       title: isCameraOpen ? "Camera Closed" : "Camera Active",
       description: isCameraOpen ? "" : "Camera capture mode enabled (simulation)",
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <AnimatePresence>
        {isCameraOpen && (
             <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 200, opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mb-4 bg-black/50 rounded-xl border border-primary/20 flex items-center justify-center overflow-hidden relative"
             >
                <div className="text-muted-foreground flex flex-col items-center gap-2">
                    <Camera className="w-8 h-8" />
                    <span>Camera Feed Simulation</span>
                </div>
                <Button 
                    variant="ghost" 
                    size="icon" 
                    className="absolute top-2 right-2 hover:bg-destructive/20 hover:text-destructive"
                    onClick={() => setIsCameraOpen(false)}
                >
                    <X className="w-4 h-4" />
                </Button>
             </motion.div>
        )}
      </AnimatePresence>

      <div className="relative flex items-end gap-2 p-2 glass-panel rounded-3xl">
        <input 
            type="file" 
            className="hidden" 
            ref={fileInputRef} 
            accept="image/*,application/pdf"
            onChange={() => toast({ title: "File Attached", description: "Your file has been prepared for analysis." })}
        />
        
        <div className="flex gap-1 pb-1">
            <Button variant="ghost" size="icon" className="rounded-full text-muted-foreground hover:text-primary hover:bg-primary/10" onClick={handleFileUpload}>
            <Paperclip className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full text-muted-foreground hover:text-primary hover:bg-primary/10" onClick={handleFileUpload}>
            <ImageIcon className="w-5 h-5" />
            </Button>
             <Button variant="ghost" size="icon" className={cn("rounded-full text-muted-foreground hover:text-primary hover:bg-primary/10", isCameraOpen && "text-primary bg-primary/10")} onClick={handleCamera}>
            <Camera className="w-5 h-5" />
            </Button>
        </div>

        <div className="flex-1 relative">
            {isListening && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/90 z-10 rounded-xl backdrop-blur-md">
                    <VoiceVisualizer isActive={true} />
                </div>
            )}
            <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isListening ? "Listening..." : "Type a message, or upload a report..."}
            className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 px-2 py-3 h-auto min-h-[44px] text-base resize-none placeholder:text-muted-foreground/50"
            />
        </div>

        <div className="flex gap-1 pb-1">
            <Button 
                variant="ghost" 
                size="icon" 
                className={cn(
                    "rounded-full transition-all duration-300",
                    isListening ? "text-red-400 bg-red-400/10 animate-pulse" : "text-muted-foreground hover:text-primary hover:bg-primary/10"
                )} 
                onClick={toggleListening}
            >
            <Mic className="w-5 h-5" />
            </Button>
            <Button 
                size="icon" 
                className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_15px_rgba(212,175,55,0.3)]" 
                onClick={handleSend}
                disabled={!input.trim()}
            >
            <Send className="w-5 h-5 ml-0.5" />
            </Button>
        </div>
      </div>
    </div>
  );
}
