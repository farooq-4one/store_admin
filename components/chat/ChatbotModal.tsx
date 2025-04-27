import React, { useState } from "react";
import { useUser } from "@clerk/nextjs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";

interface ChatbotModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ChatbotModal: React.FC<ChatbotModalProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<{ text: string; isUser: boolean }[]>(
    [{ text: "Hello, how can I help you?", isUser: false }]
  );
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useUser();

  const handleSend = async () => {
    const userId = user?.id;
    if (!userId) {
      return { message: "Unauthorized", status: 401 };
    }

    console.log("User ID of ChatbotModel:", userId);

    if (input.trim()) {
      setMessages([...messages, { text: input, isUser: true }]);
      const userMessage = input;
      setInput("");
      setIsLoading(true);

      try {
        const response = await axios.post(
          "https://chatbot-api-indol.vercel.app/chat",
          {
            message: userMessage,
            userId: userId,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        setMessages((prev) => [
          ...prev,
          {
            text:
              response.data.response ||
              "Sorry, I could not process your request.",
            isUser: false,
          },
        ]);
      } catch (error: any) {
        console.error("API error:", {
          message: error.message,
          code: error.code,
          response: error.response?.data,
          status: error.response?.status,
        });
        const errorMessage =
          error.code === "ERR_NETWORK"
            ? "Network error: Unable to reach the server. Please check your connection."
            : error.response?.data?.error ||
              "Oops, something went wrong. Please try again.";
        setMessages((prev) => [...prev, { text: errorMessage, isUser: false }]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-sm p-0">
        <DialogHeader className="p-4 pb-0">
          <DialogTitle>Chatbot</DialogTitle>
        </DialogHeader>
        <div className="h-[60vh] overflow-y-auto">
          <div className="flex flex-col gap-2 p-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex flex-col ${
                  msg.isUser ? "items-end" : "items-start"
                }`}
              >
                <div
                  className={`rounded-2xl overflow-hidden px-6 py-2 text-xs max-w-[90%] ${
                    msg.isUser ? "bg-[#efffde]" : "bg-gray-100"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="p-4 text-center text-gray-500">Loading...</div>
            )}
          </div>
        </div>
        <div className="flex items-center p-4">
          <Input
            type="text"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            className="mr-2 text-xs"
            disabled={isLoading}
          />
          <Button
            onClick={handleSend}
            className="bg-sky-500 hover:bg-sky-600 text-white"
            disabled={isLoading}
          >
            Send
          </Button>
        </div>
        <div className="flex justify-end space-x-4 p-4 pt-0">
          <Button
            variant="outline"
            onClick={onClose}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800"
          >
            Minimize
          </Button>
          <Button
            variant="destructive"
            onClick={onClose}
            className="bg-red-500 hover:bg-red-600 text-white"
          >
            Exit
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ChatbotModal;
