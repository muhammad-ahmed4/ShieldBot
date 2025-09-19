import { useState, useEffect, useRef } from "react";
import { ChatMessage } from "./components/ChatMessage";
import { ChatInput } from "./components/ChatInput";
import { ChatHeader } from "./components/ChatHeader";
import { TypingIndicator } from "./components/TypingIndicator";
import { Sidebar } from "./components/Sidebar";
import { ScrollArea } from "./components/ui/scroll-area";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const mockResponses = [
  "Hello! I'm your AI assistant. How can I help you today?",
  "That's an interesting question! Let me think about that for a moment.",
  "I understand what you're asking. Here's my perspective on that topic...",
  "Great question! Based on the information you've provided, I'd suggest...",
  "I'm here to help with whatever you need. Feel free to ask me anything!",
  "That's a complex topic with many facets. Let me break it down for you...",
  "I appreciate you sharing that with me. Here's what I think about it...",
  "Excellent point! That reminds me of a few key considerations...",
];

export default function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! I'm your AI assistant powered by advanced language models. How can I help you today?",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentChatId, setCurrentChatId] = useState("1");
  const [selectedModel, setSelectedModel] = useState("gemini-pro");
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async (text: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    // Simulate AI response delay
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: mockResponses[Math.floor(Math.random() * mockResponses.length)],
        isUser: false,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500 + Math.random() * 1000);
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: "1",
        text: "Hello! I'm your AI assistant powered by advanced language models. How can I help you today?",
        isUser: false,
        timestamp: new Date(),
      },
    ]);
    setIsTyping(false);
  };

  const handleNewChat = () => {
    const newChatId = Date.now().toString();
    setCurrentChatId(newChatId);
    handleClearChat();
  };

  const handleSelectChat = (chatId: string) => {
    setCurrentChatId(chatId);
    // In a real app, you would load the chat history here
    handleClearChat();
  };

  const handleBack = () => {
    // Navigation logic would go here
    console.log("Back button clicked");
  };

  const handleModelChange = (model: string) => {
    setSelectedModel(model);
    // In a real app, you would switch the AI model here
    console.log("Model changed to:", model);
  };

  return (
    <div className="h-screen flex bg-background text-foreground dark">
      <Sidebar 
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        onNewChat={handleNewChat}
        currentChatId={currentChatId}
        onSelectChat={handleSelectChat}
      />
      
      <div className="flex-1 flex flex-col">
        <ChatHeader 
          onClearChat={handleClearChat}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          sidebarOpen={sidebarOpen}
          onBack={handleBack}
          selectedModel={selectedModel}
          onModelChange={handleModelChange}
        />
        
        <ScrollArea ref={scrollAreaRef} className="flex-1 bg-background">
          <div className="min-h-full flex flex-col">
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message.text}
                isUser={message.isUser}
                timestamp={message.timestamp}
              />
            ))}
            {isTyping && <TypingIndicator />}
          </div>
        </ScrollArea>

        <ChatInput onSendMessage={handleSendMessage} disabled={isTyping} />
      </div>
    </div>
  );
}