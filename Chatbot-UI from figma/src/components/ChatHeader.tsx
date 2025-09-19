import { Bot, MoreVertical, ArrowLeft, Menu, ChevronDown } from "lucide-react";
import { Button } from "./ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

interface ChatHeaderProps {
  onClearChat: () => void;
  onToggleSidebar: () => void;
  sidebarOpen: boolean;
  onBack?: () => void;
  selectedModel: string;
  onModelChange: (model: string) => void;
}

export function ChatHeader({ onClearChat, onToggleSidebar, sidebarOpen, onBack, selectedModel, onModelChange }: ChatHeaderProps) {
  return (
    <div className="border-b border-sidebar-border bg-gradient-to-r from-sidebar to-sidebar/95 backdrop-blur-sm p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {!sidebarOpen && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleSidebar}
              className="text-muted-foreground hover:text-foreground hover:bg-sidebar-accent flex items-center justify-center"
            >
              <Menu className="size-4" />
            </Button>
          )}
          
          {onBack && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="text-muted-foreground hover:text-foreground hover:bg-sidebar-accent flex items-center justify-center"
            >
              <ArrowLeft className="size-4" />
            </Button>
          )}
          
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center size-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
              <Bot className="size-5 text-white" />
            </div>
            <div>
              <h1 className="text-foreground font-medium">AI Assistant</h1>
              <p className="text-sm text-muted-foreground">Powered by AI</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Model Selection */}
          <Select value={selectedModel} onValueChange={onModelChange}>
            <SelectTrigger className="w-40 bg-sidebar-accent border-sidebar-border text-foreground hover:bg-sidebar-accent/80 transition-colors">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-sidebar border-sidebar-border">
              <SelectItem value="gemini-pro" className="text-foreground hover:bg-sidebar-accent cursor-pointer">
                Gemini Pro
              </SelectItem>
              <SelectItem value="gemini-ultra" className="text-foreground hover:bg-sidebar-accent cursor-pointer">
                Gemini Ultra
              </SelectItem>
              <SelectItem value="gpt-4" className="text-foreground hover:bg-sidebar-accent cursor-pointer">
                GPT-4
              </SelectItem>
              <SelectItem value="claude-3" className="text-foreground hover:bg-sidebar-accent cursor-pointer">
                Claude 3
              </SelectItem>
            </SelectContent>
          </Select>
        
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground hover:bg-sidebar-accent flex items-center justify-center">
                <MoreVertical className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-sidebar border-sidebar-border">
              <DropdownMenuItem 
                onClick={onClearChat}
                className="text-foreground hover:bg-sidebar-accent cursor-pointer"
              >
                Clear chat
              </DropdownMenuItem>
              <DropdownMenuItem className="text-foreground hover:bg-sidebar-accent cursor-pointer">
                Export chat
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}