import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, MessageCircle, X, Bot, User, Minimize2, Maximize2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface TourAIChatBotProps {
  sessionId?: string;
}

const TourAIChatBot: React.FC<TourAIChatBotProps> = ({ sessionId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Get unique session ID for this guest
  const guestSessionId = sessionId || localStorage.getItem("current_guest_session") || "default";

  useEffect(() => {
    // Load chat history for this specific session
    const savedMessages = localStorage.getItem(`tour_chat_${guestSessionId}`);
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    } else {
      // Initialize with welcome message
      const welcomeMessage: Message = {
        id: Date.now().toString(),
        content: `Hello! I'm your personal travel assistant for XTSY Tours! I can help you with:

**Tour Package Information** - Get details about our Meghalaya adventures
**Booking Assistance** - Help you choose the perfect travel dates
**Custom Recommendations** - Suggest packages based on your preferences
**Pricing & Offers** - Information about rates and special deals
**Itinerary Planning** - Detailed day-by-day activities
**Accommodation Details** - Where you'll stay during tours

What would you like to know about our travel packages?`,
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    }
  }, [guestSessionId]);

  useEffect(() => {
    // Save messages to localStorage for this specific session
    if (messages.length > 0) {
      localStorage.setItem(`tour_chat_${guestSessionId}`, JSON.stringify(messages));
    }
  }, [messages, guestSessionId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const simulateAIResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    if (message.includes('price') || message.includes('cost') || message.includes('rate')) {
      return `**Tour Package Pricing:**

Our packages start from ₹2,800 per person per day as base rate:

**Adventure Packages** (15% premium): ₹3,220/day
**Cultural Packages** (10% premium): ₹3,080/day  
**Leisure Packages**: ₹2,800/day (base rate)

**Popular Packages:**
• Meghalaya Hidden Gems (5 days): ₹12,999
• Cherrapunji Monsoon Trek (4 days): ₹15,999
• Offbeat Meghalaya Circuit (7 days): ₹22,999

All prices include 18% GST. Group discounts available for 6+ people!`;
    }

    if (message.includes('book') || message.includes('booking')) {
      return `**Easy Booking Process:**

1. **Choose Your Package** - Click on any tour card
2. **Select Details** - Pick dates, number of guests
3. **Add to Cart** - Review your selection
4. **Guest Information** - Fill in lead traveler details
5. **Secure Payment** - Pay online safely

**Need Help?** I can assist you with:
• Finding the perfect package for your group
• Selecting the best travel dates
• Understanding what's included
• Payment options and policies

Would you like me to recommend a package based on your preferences?`;
    }

    if (message.includes('recommend') || message.includes('suggest') || message.includes('best')) {
      return `**Perfect! Let me help you find the ideal package:**

**For Adventure Lovers:**
Cherrapunji Monsoon Trek (4 days) - Experience living root bridges
Rating: 4.9/5 - ₹15,999

**For Cultural Enthusiasts:**
Shillong Cultural Experience (3 days) - Local markets & cuisine  
Rating: 4.6/5 - ₹8,999

**For Relaxed Travelers:**
Mawlynnong Clean Village Tour (2 days) - Asia's cleanest village
Rating: 4.5/5 - ₹7,499

**Most Popular:**
Meghalaya Hidden Gems (5 days) - Waterfalls & root bridges
Rating: 4.8/5 - ₹12,999

What type of experience interests you most?`;
    }

    if (message.includes('group') || message.includes('family')) {
      return `**Group & Family Packages:**

**Special Group Benefits:**
10% discount for groups of 6+ people
Free group transportation included
Dedicated group coordinator
Group accommodation arrangements

**Family-Friendly Options:**
• Dawki River Adventure (2 days) - Easy difficulty
• Meghalaya Photography Tour (6 days) - All skill levels
• Wellness Retreat (5 days) - Relaxing for all ages

**Group Activities:**
Guided nature walks
Group photography sessions  
Traditional group meals
Local craft workshops

How many people are in your group? I'll suggest the perfect package!`;
    }

    if (message.includes('include') || message.includes('accommodation') || message.includes('food')) {
      return `**What's Included in Our Packages:**

**Accommodation:**
• Clean, comfortable lodging
• Based on package (hostels/hotels/homestays)
• Shared or private rooms as specified

**Meals:**
• Daily breakfast included
• Local lunch during excursions
• Traditional dinner experiences
• Vegetarian/non-vegetarian options

**Transportation:**
• All local transfers
• Comfortable vehicles
• Experienced local drivers
• Pick-up/drop-off included

**Activities:**
• Professional local guides
• Entry fees to attractions
• Safety equipment for adventures
• Group activities & experiences

**Support:**
• 24/7 emergency contact
• Travel insurance assistance
• Local SIM card help

Need details about a specific package? Just ask!`;
    }

    if (message.includes('season') || message.includes('weather') || message.includes('when')) {
      return `**Best Time to Visit Meghalaya:**

**Peak Season (Oct-Mar):**
• Perfect weather - cool & pleasant
• Clear skies for photography  
• Ideal for most packages
• Higher demand - book early!

**Monsoon Season (Jun-Sep):**
• Unique experience - lush greenery
• Spectacular waterfalls
• Special monsoon packages available
• Adventure seekers' paradise!

**Summer Season (Apr-May):**
• Moderate temperatures
• Good for cultural tours
• Less crowded attractions
• Great value deals

**Package-Specific Seasons:**
Cherrapunji Trek: Jun-Sep (monsoon magic)
Cultural Tours: Year-round
Nature Tours: Oct-Mar (best weather)

When are you planning to visit?`;
    }

    // Default response
    return `Thank you for your question! 

I'm here to help you with everything about XTSY Tours:

**Popular Topics:**
• Tour package details & pricing
• Best times to visit Meghalaya  
• Group bookings & discounts
• What's included in packages
• Booking process & payments
• Custom recommendations

You can also:
Ask for package recommendations
Get contact information
Chat about specific destinations
Plan your perfect itinerary

What specific information would you like about our Meghalaya adventures? I'm here to help make your trip unforgettable!`;
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage.trim(),
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    // Simulate AI response delay
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: simulateAIResponse(inputMessage),
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Don't render the floating button - this component will be integrated differently
  if (!isOpen) {
    return null;
  }

  return (
    <div className={`fixed ${isMinimized ? 'bottom-6 right-6' : 'bottom-6 right-6'} z-50 ${isMinimized ? 'w-80' : 'w-96'} transition-all duration-300`}>
      <Card className={`${isMinimized ? 'h-16' : 'h-[500px]'} shadow-2xl border-0 bg-white/95 backdrop-blur-xs overflow-hidden transition-all duration-300`}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-orange-500 to-red-600 text-white">
          <CardTitle className="text-sm font-semibold flex items-center gap-2 font-josefin">
            <Bot className="h-4 w-4" />
            Tour AI Assistant
            <span className="text-xs opacity-75">({guestSessionId.slice(-8)})</span>
          </CardTitle>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMinimized(!isMinimized)}
              className="h-8 w-8 p-0 text-white hover:bg-white/20"
            >
              {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="h-8 w-8 p-0 text-white hover:bg-white/20"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        {!isMinimized && (
          <CardContent className="p-0 h-full flex flex-col">
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.sender === 'user'
                          ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        {message.sender === 'bot' && <Bot className="h-4 w-4 mt-0.5 flex-shrink-0" />}
                        {message.sender === 'user' && <User className="h-4 w-4 mt-0.5 flex-shrink-0" />}
                        <div className="flex-1">
                          <p className="text-sm whitespace-pre-wrap font-cardo">{message.content}</p>
                          <p className={`text-xs mt-1 opacity-70 ${message.sender === 'user' ? 'text-white' : 'text-gray-500'}`}>
                            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 rounded-lg p-3 max-w-[80%]">
                      <div className="flex items-center gap-2">
                        <Bot className="h-4 w-4" />
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            <div className="p-4 border-t bg-gray-50">
              <div className="flex gap-2">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about our tour packages..."
                  className="flex-1 font-cardo"
                  disabled={isLoading}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isLoading}
                  className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default TourAIChatBot;