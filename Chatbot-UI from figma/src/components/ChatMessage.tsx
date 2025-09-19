import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Bot, User } from "lucide-react";

interface ChatMessageProps {
  message: string;
  isUser: boolean;
  timestamp: Date;
}

export function ChatMessage({ message, isUser, timestamp }: ChatMessageProps) {
  return (
    <div className={`flex gap-3 p-4 ${isUser ? 'flex-row-reverse' : ''} hover:bg-muted/30 transition-colors`}>
      <Avatar className="size-8 shrink-0">
        {isUser ? (
          <>
            <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face&auto=format" alt="User" />
            <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
              <User className="size-4" />
            </AvatarFallback>
          </>
        ) : (
          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
            <Bot className="size-4" />
          </AvatarFallback>
        )}
      </Avatar>
      
      <div className={`flex flex-col gap-1 max-w-[80%] ${isUser ? 'items-end' : 'items-start'}`}>
        <div
          className={`rounded-2xl px-4 py-3 shadow-sm border ${
            isUser
              ? 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-br-md border-emerald-200'
              : 'bg-card text-card-foreground rounded-bl-md border-border'
          }`}
        >
          <p className="whitespace-pre-wrap break-words leading-relaxed">{message}</p>
        </div>
        <span className="text-xs text-muted-foreground px-2">
          {timestamp.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </span>
      </div>
    </div>
  );
}