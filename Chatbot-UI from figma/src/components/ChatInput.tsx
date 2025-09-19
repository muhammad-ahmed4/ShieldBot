import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Send, Paperclip, Mic } from "lucide-react";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

export function ChatInput({ onSendMessage, disabled }: ChatInputProps) {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="border-t border-border bg-background/80 backdrop-blur-sm p-4">
      <form onSubmit={handleSubmit} className="flex gap-3 items-center max-w-4xl mx-auto">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-foreground hover:bg-accent shrink-0 flex items-center justify-center"
        >
          <Paperclip className="size-4" />
        </Button>
        
        <div className="flex-1 relative">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Message AI Assistant..."
            className="bg-muted/50 border-border text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20 pr-12 rounded-full"
            disabled={disabled}
          />
          
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-1 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground hover:bg-accent size-8 p-0 rounded-full flex items-center justify-center"
          >
            <Mic className="size-4" />
          </Button>
        </div>
        
        <Button
          type="submit"
          disabled={!message.trim() || disabled}
          size="sm"
          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white disabled:from-muted disabled:to-muted disabled:text-muted-foreground shrink-0 rounded-full px-4 shadow-lg transition-all duration-200 flex items-center justify-center"
        >
          <Send className="size-4" />
        </Button>
      </form>
    </div>
  );
}