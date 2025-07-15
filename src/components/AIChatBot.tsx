
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageCircle, X, Send, Bot, User, HelpCircle } from "lucide-react";

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
      text: "Hey there! I'm XTSY AI Assistant, your Gen Z travel buddy for Meghalaya! Ask me anything about XTSY hostels, Shillong vibes, check-in/out times, or travel tips. What's up?",
      isBot: true,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [showQuickQuestions, setShowQuickQuestions] = useState(true);

  // Common FAQs for Meghalaya travelers
  const quickQuestions = [
    "What are XTSY hostel timings?",
    "Can I get early check-in?",
    "Best places to visit in Shillong?",
    "How to reach XTSY from airport?",
    "What's included in breakfast?",
    "Is WiFi free at XTSY?",
    "Weather in Meghalaya?",
    "Local food recommendations?"
  ];

  const handleSendMessage = (question?: string) => {
    const messageText = question || inputMessage.trim();
    if (!messageText) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: messageText,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setShowQuickQuestions(false);

    // Enhanced AI responses with Gen Z vibes
    setTimeout(() => {
      let response = getAIResponse(messageText.toLowerCase());
      
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        isBot: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
    }, 1000);
  };

  const getAIResponse = (question: string): string => {
    // XTSY policies and Gen Z responses
    if (question.includes("timing") || question.includes("check")) {
      return "Check-in: 2 PM onwards (but we're chill about early arrivals if rooms are ready!) Check-out: 11 AM. Need to leave later? Just ask! We're pretty flexible. No cap! 😎";
    }
    
    if (question.includes("early check") || question.includes("late check")) {
      return "Absolutely! Early check-in and late check-out are totally doable when we have availability. Just hit us up on WhatsApp or mention it when booking. We're all about making your stay stress-free! ✨";
    }
    
    if (question.includes("places") || question.includes("visit") || question.includes("shillong")) {
      return "Bruh, Shillong hits different! Must-visits: Police Bazaar for shopping vibes, Elephant Falls for Insta pics, Shillong Peak for sunrise goals, and Don Bosco Museum for culture flex. Ward's Lake is perfect for chill evenings! 🌅📸";
    }
    
    if (question.includes("airport") || question.includes("reach") || question.includes("transport")) {
      return "From Umroi Airport: Grab a taxi (45 mins, ₹800-1000) or book our airport transfer! From Guwahati Airport: Train to Guwahati, then taxi/bus to Shillong (3-4 hours total). Pro tip: Book advance for better rates! 🚗";
    }
    
    if (question.includes("breakfast") || question.includes("food")) {
      return "Our breakfast is fire! Traditional Meghalayan dishes, bread, eggs, and tea/coffee. Plus, female travelers get FREE breakfast because we stan supporting our queens! 👑🍳";
    }
    
    if (question.includes("wifi") || question.includes("internet")) {
      return "Free WiFi that actually works! Stream, post, video call home - we got you covered. Password is usually at reception or just ask staff. Stay connected, bestie! 📱💫";
    }
    
    if (question.includes("weather") || question.includes("climate")) {
      return "Meghalaya weather is moody but gorgeous! Summers (Mar-Jun): 15-25°C, perfect vibes. Monsoon (Jun-Sep): Heavy rains but stunning waterfalls. Winter (Oct-Feb): 4-15°C, pack warm! Always carry a jacket fr! 🌦️";
    }
    
    if (question.includes("food") || question.includes("eat") || question.includes("restaurant")) {
      return "Local food scene is unmatched! Try jadoh (rice dish), dohneiiong (pork curry), and tungrymbai (fermented soybean). Cafes: Café Shillong, ML05 Café for coffee dates, and City Hut Family Dhaba for authentic vibes! 🍛☕";
    }
    
    if (question.includes("price") || question.includes("cost") || question.includes("rate")) {
      return "We keep it budget-friendly! Dorm beds from ₹600/night, private rooms from ₹2500/night. Check our deals page for discounts - XTSY-DEAL gives 10% off for groups of 4+! Value for money, no scam! 💰";
    }
    
    // Default response
    return "That's a great question! For the most up-to-date info and personalized help, our team is always ready to assist. Hit up our WhatsApp for instant replies - we're basically online 24/7! 🤙✨";
  };

  const handleWhatsAppConnect = () => {
    window.open("https://wa.me/918837317070?text=Hi! I need help with property and travel information.", "_blank");
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
          </div>

          {/* WhatsApp Connect Button */}
          <div className="p-2 border-t">
            <Button
              onClick={handleWhatsAppConnect}
              className="w-full bg-green-500 hover:bg-green-600 text-white text-xs py-2"
            >
              💬 Connect on WhatsApp
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
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default AIChatBot;
