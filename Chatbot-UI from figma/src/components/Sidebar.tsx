import { useState } from "react";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { 
  Plus, 
  MessageSquare, 
  MoreHorizontal, 
  Trash2, 
  Edit3,
  Menu,
  X,
  Settings,
  User
} from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";

interface Chat {
  id: string;
  title: string;
  timestamp: Date;
}

interface UserInfo {
  name: string;
  email: string;
  avatar?: string;
}

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  onNewChat: () => void;
  currentChatId?: string;
  onSelectChat?: (chatId: string) => void;
}

export function Sidebar({ isOpen, onToggle, onNewChat, currentChatId, onSelectChat }: SidebarProps) {
  const [chats] = useState<Chat[]>([
    { id: "1", title: "Getting started with AI", timestamp: new Date(Date.now() - 1000 * 60 * 30) },
    { id: "2", title: "React development tips", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2) },
    { id: "3", title: "Machine learning basics", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24) },
    { id: "4", title: "Web design principles", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48) },
  ]);

  const [userInfo] = useState<UserInfo>({
    name: "John Smith",
    email: "john.smith@example.com",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face&auto=format"
  });

  const formatChatTime = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return "Yesterday";
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  if (!isOpen) {
    return (
      <div className="flex flex-col bg-sidebar border-r border-sidebar-border">
        <div className="p-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="text-sidebar-foreground hover:bg-sidebar-accent w-full justify-center flex items-center"
          >
            <Menu className="size-4" />
          </Button>
        </div>
        <div className="p-3 pt-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={onNewChat}
            className="text-sidebar-foreground hover:bg-sidebar-accent w-full justify-center flex items-center"
          >
            <Plus className="size-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
      {/* Header */}
      <div className="p-3 border-b border-sidebar-border">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sidebar-foreground text-sm font-medium">Conversations</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent size-6 p-0 flex items-center justify-center"
          >
            <X className="size-4" />
          </Button>
        </div>
        
        <Button
          onClick={onNewChat}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white justify-start gap-2 shadow-lg transition-all duration-200"
        >
          <Plus className="size-4" />
          New Chat
        </Button>
      </div>

      {/* Chat List */}
      <ScrollArea className="flex-1">
        <div className="p-2">
          {chats.map((chat) => (
            <div
              key={chat.id}
              className={`group flex items-center gap-2 p-3 rounded-lg mb-2 cursor-pointer transition-all duration-200 ${
                currentChatId === chat.id
                  ? 'bg-sidebar-accent text-sidebar-foreground shadow-sm border border-sidebar-border/50'
                  : 'text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground'
              }`}
              onClick={() => onSelectChat?.(chat.id)}
            >
              <div className={`flex items-center justify-center size-8 rounded-lg transition-colors ${
                currentChatId === chat.id ? 'bg-gradient-to-br from-blue-500 to-purple-600' : 'bg-sidebar-accent'
              }`}>
                <MessageSquare className={`size-4 ${currentChatId === chat.id ? 'text-white' : 'text-muted-foreground'}`} />
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-medium">{chat.title}</p>
                <p className="text-xs text-muted-foreground">{formatChatTime(chat.timestamp)}</p>
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="opacity-0 group-hover:opacity-100 size-6 p-0 text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent/50 flex items-center justify-center"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreHorizontal className="size-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-sidebar border-sidebar-border">
                  <DropdownMenuItem className="text-sidebar-foreground hover:bg-sidebar-accent cursor-pointer">
                    <Edit3 className="size-3 mr-2" />
                    Rename
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive hover:bg-sidebar-accent cursor-pointer">
                    <Trash2 className="size-3 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* User Profile Section */}
      <div className="p-3 border-t border-sidebar-border">
        <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-sidebar-accent transition-colors cursor-pointer">
          <Avatar className="size-8">
            <AvatarImage src={userInfo.avatar} alt={userInfo.name} />
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-sm">
              {userInfo.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-sidebar-foreground truncate">{userInfo.name}</p>
            <p className="text-xs text-muted-foreground truncate">{userInfo.email}</p>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="size-6 p-0 text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent/50 flex items-center justify-center"
              >
                <MoreHorizontal className="size-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-sidebar border-sidebar-border">
              <DropdownMenuItem className="text-sidebar-foreground hover:bg-sidebar-accent cursor-pointer">
                <User className="size-3 mr-2" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem className="text-sidebar-foreground hover:bg-sidebar-accent cursor-pointer">
                <Settings className="size-3 mr-2" />
                Settings
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}