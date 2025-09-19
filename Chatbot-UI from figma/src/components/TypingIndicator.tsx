import { Avatar, AvatarFallback } from "./ui/avatar";
import { Bot } from "lucide-react";

export function TypingIndicator() {
  return (
    <div className="flex gap-3 p-4 hover:bg-muted/30 transition-colors">
      <Avatar className="size-8 shrink-0">
        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
          <Bot className="size-4" />
        </AvatarFallback>
      </Avatar>
      
      <div className="flex flex-col gap-1">
        <div className="bg-card text-card-foreground rounded-2xl rounded-bl-md px-4 py-3 shadow-sm border border-border">
          <div className="flex gap-1 items-center">
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
            </div>
            <span className="text-sm text-muted-foreground ml-2">AI is thinking...</span>
          </div>
        </div>
      </div>
    </div>
  );
}