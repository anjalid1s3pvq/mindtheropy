import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import botAvatar from "@assets/generated_images/marble_and_gold_kintsugi_abstract_sculpture_avatar.png";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  type?: "text" | "image" | "audio";
  timestamp: Date;
}

interface ChatBubbleProps {
  message: Message;
}

export function ChatBubble({ message }: ChatBubbleProps) {
  const isUser = message.role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "flex w-full gap-4 mb-6",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      {!isUser && (
        <Avatar className="h-10 w-10 border border-primary/20 shadow-lg shrink-0">
          <AvatarImage src={botAvatar} alt="Serenity AI" className="object-cover" />
          <AvatarFallback className="bg-secondary text-primary">AI</AvatarFallback>
        </Avatar>
      )}

      <div
        className={cn(
          "relative max-w-[80%] p-4 md:p-6 rounded-2xl text-sm md:text-base leading-relaxed shadow-md",
          isUser
            ? "bg-secondary/80 text-white rounded-tr-sm backdrop-blur-sm border border-white/5"
            : "glass-panel text-foreground rounded-tl-sm"
        )}
      >
        {message.content}
        <span className="block text-[10px] opacity-50 mt-2 font-mono uppercase tracking-widest">
          {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </span>
      </div>

      {isUser && (
        <Avatar className="h-10 w-10 border border-white/10 shadow-lg shrink-0">
          <AvatarFallback className="bg-primary/20 text-primary">ME</AvatarFallback>
        </Avatar>
      )}
    </motion.div>
  );
}
