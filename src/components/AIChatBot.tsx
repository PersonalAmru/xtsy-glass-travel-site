
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageCircle, X, Send, Bot, User, HelpCircle } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

const AIChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hi! I'm your XTSY travel assistant. I can help you plan your trip to Northeast India, find the best destinations, and book accommodations. What would you like to know?",
      isBot: true,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [showQuickQuestions, setShowQuickQuestions] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const sessionId = useRef(Math.random().toString(36).substring(7));

  // Common FAQs for Meghalaya travelers
  const quickQuestions = [
    "What are XTSY hostel timings?",
    "Can I get early check-in?",
    "Best places to visit in Shillong?",
    "How to reach XTSY from airport?",
    "What's included in stay?",
    "Is WiFi free at XTSY?",
    "Weather in Meghalaya?",
    "Local food recommendations?"
  ];

  const handleSendMessage = async (question?: string) => {
    const messageText = question || inputMessage.trim();
    if (!messageText || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: messageText,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setShowQuickQuestions(false);
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('ai-travel-assistant', {
        body: {
          message: messageText,
          sessionId: sessionId.current,
          userEmail: null
        }
      });

      if (error) {
        console.error('Error calling AI assistant:', error);
        throw error;
      }

      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: data?.response || "I'm here to help you with travel information about Northeast India and XTSY properties. What would you like to know?",
        isBot: true,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      console.error('Error calling AI assistant:', error);
      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm here to help you plan your Northeast India trip! I can provide information about destinations in Meghalaya, Shillong attractions, XTSY accommodation options, local culture, weather, and travel tips. What would you like to explore?",
        isBot: true,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleWhatsAppConnect = () => {
    window.open("https://api.whatsapp.com/send/?phone=918837317070&text=Hi!%20I%20need%20help%20with%20property%20and%20travel%20information.&type=phone_number&app_absent=0", "_blank");
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <div className="fixed bottom-4 left-4 z-50">
        {!isOpen && (
          <Button
            onClick={() => setIsOpen(true)}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-full p-3 shadow-2xl transition-all duration-300 transform hover:scale-110"
          >
            <MessageCircle className="h-6 w-6" />
          </Button>
        )}
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-4 left-4 z-50 w-80 sm:w-96 h-96 bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              <span className="font-bold text-sm">XTSY AI Assistant</span>
            </div>
            <Button
              onClick={() => setIsOpen(false)}
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20 p-1"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start gap-2 ${
                  message.isBot ? "justify-start" : "justify-end"
                }`}
              >
                {message.isBot && (
                  <div className="bg-blue-100 rounded-full p-1">
                    <Bot className="h-4 w-4 text-blue-600" />
                  </div>
                )}
                <div
                  className={`max-w-[70%] p-2 rounded-lg text-sm ${
                    message.isBot
                      ? "bg-gray-100 text-gray-800"
                      : "bg-blue-500 text-white"
                  }`}
                >
                  {message.text}
                </div>
                {!message.isBot && (
                  <div className="bg-blue-100 rounded-full p-1">
                    <User className="h-4 w-4 text-blue-600" />
                  </div>
                )}
              </div>
            ))}
            
            {/* Quick Questions */}
            {showQuickQuestions && (
              <div className="space-y-2">
                <div className="text-xs text-gray-500 flex items-center gap-1">
                  <HelpCircle className="h-3 w-3" />
                  Quick questions:
                </div>
                <div className="grid grid-cols-1 gap-1">
                  {quickQuestions.slice(0, 4).map((q, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => handleSendMessage(q)}
                      className="text-xs h-8 justify-start bg-white hover:bg-blue-50 border-blue-200 text-blue-600"
                    >
                      {q}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {isLoading && (
              <div className="flex items-start gap-2 justify-start">
                <div className="bg-blue-100 rounded-full p-1">
                  <Bot className="h-4 w-4 text-blue-600" />
                </div>
                <div className="bg-gray-100 text-gray-800 p-2 rounded-lg text-sm">
                  <div className="flex items-center gap-1">
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-500"></div>
                    <span>Thinking...</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* WhatsApp Connect Button */}
          <div className="p-2 border-t">
            <Button
              onClick={handleWhatsAppConnect}
              className="w-full bg-green-500 hover:bg-green-600 text-white text-xs py-2"
            >
              Connect on WhatsApp
            </Button>
          </div>

          {/* Input */}
          <div className="p-3 border-t flex gap-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask me anything about XTSY or Meghalaya..."
              className="flex-1 text-sm"
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            />
            <Button
              onClick={() => handleSendMessage()}
              size="sm"
              className="bg-blue-500 hover:bg-blue-600 text-white"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default AIChatBot;
