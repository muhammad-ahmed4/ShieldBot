import { writable } from "svelte/store";
import {
  clientChatService,
  type ChatMessage,
} from "$lib/services/clientChatService";

export interface ChatState {
  messages: ChatMessage[];
  isTyping: boolean;
  isStreaming: boolean;
  error: string | null;
  currentChatId: string | null;
}

const initialState: ChatState = {
  messages: [
    {
      id: "1",
      role: "assistant",
      content:
        "Hello! I'm your AI assistant powered by Google Gemini. How can I help you today?",
      timestamp: new Date(),
    },
  ],
  isTyping: false,
  isStreaming: false,
  error: null,
  currentChatId: "1",
};

function createChatStore() {
  const { subscribe, set, update } = writable<ChatState>(initialState);

  return {
    subscribe,

    // Send a message and get AI response
    async sendMessage(content: string) {
      if (!content.trim()) return;

      update((state) => ({
        ...state,
        isTyping: true,
        isStreaming: true,
        error: null,
      }));

      // Add user message
      const userMessage = clientChatService.createMessage("user", content);
      update((state) => ({
        ...state,
        messages: [...state.messages, userMessage],
      }));

      // Add placeholder AI message
      const aiMessage = clientChatService.createMessage("assistant", "");
      update((state) => ({
        ...state,
        messages: [...state.messages, aiMessage],
      }));

      try {
        // Get conversation history (excluding the placeholder AI message)
        let conversationHistory: ChatMessage[] = [];
        update((state) => {
          conversationHistory = state.messages.slice(0, -1);
          return state;
        });

        // Stream AI response
        let accumulatedContent = "";
        for await (const chunk of clientChatService.sendStreamingMessage(
          content,
          conversationHistory
        )) {
          if (chunk.type === "chunk" && chunk.content) {
            accumulatedContent += chunk.content;

            // Update the AI message content
            update((state) => ({
              ...state,
              messages: state.messages.map((msg, index) =>
                index === state.messages.length - 1
                  ? { ...msg, content: accumulatedContent }
                  : msg
              ),
            }));
          } else if (chunk.type === "complete") {
            // Finalize the message
            update((state) => ({
              ...state,
              messages: state.messages.map((msg, index) =>
                index === state.messages.length - 1
                  ? { ...msg, content: accumulatedContent }
                  : msg
              ),
              isTyping: false,
              isStreaming: false,
            }));
            break;
          } else if (chunk.type === "error") {
            throw new Error(chunk.error || "Unknown error occurred");
          }
        }
      } catch (error) {
        console.error("Error sending message:", error);
        const errorMessage =
          error instanceof Error ? error.message : "Failed to send message";

        // Update the AI message with error
        update((state) => ({
          ...state,
          messages: state.messages.map((msg, index) =>
            index === state.messages.length - 1
              ? {
                  ...msg,
                  content: `Sorry, I encountered an error: ${errorMessage}`,
                }
              : msg
          ),
          error: errorMessage,
          isTyping: false,
          isStreaming: false,
        }));
      }
    },

    // Clear the chat
    clearChat() {
      update((state) => ({
        ...state,
        messages: [
          {
            id: "1",
            role: "assistant",
            content:
              "Hello! I'm your AI assistant powered by Google Gemini. How can I help you today?",
            timestamp: new Date(),
          },
        ],
        error: null,
        isTyping: false,
        isStreaming: false,
      }));
    },

    // Clear error
    clearError() {
      update((state) => ({
        ...state,
        error: null,
      }));
    },

    // Set current chat ID
    setCurrentChatId(chatId: string) {
      update((state) => ({
        ...state,
        currentChatId: chatId,
      }));
    },

    // Reset to initial state
    reset() {
      set(initialState);
    },
  };
}

export const chatStore = createChatStore();
