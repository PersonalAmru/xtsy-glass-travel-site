import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, Users, CheckCircle2 } from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Events = () => {
  const { formatPrice } = useApp();

  const events = [
    {
      id: 1,
      title: "Anvantara Ft. Cosmogonia | Nov 08th | Shillong",
      subtitle: "COSMOGONIA LIVE - FIRST TIME IN SHILLONG!",
      startDate: "November 8, 2025",
      endDate: "November 9, 2025",
      timing: "6:00 pm - 10:00 am",
      location: "Shillong",
      verified: true,
      image: "/lovable-uploads/shillong-cultural.jpg",
      tickets: [
        {
          type: "Solo Pass - Early Birds",
          description: "Solo Pass For One",
          price: 999,
          available: true
        },
        {
          type: "Group Of 5 - Early Birds", 
          description: "Entry For 5 People",
          price: 3999,
          available: true
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Upcoming Events
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Join us for unforgettable experiences and live music events in the heart of Northeast India
            </p>
          </div>

          {/* Events Grid */}
          <div className="grid gap-8 max-w-4xl mx-auto">
            {events.map((event) => (
              <Card key={event.id} className="overflow-hidden bg-card/50 backdrop-blur-sm border-border/50 hover:bg-card/70 transition-all duration-300">
                <div className="md:flex">
                  {/* Event Image */}
                  <div className="md:w-1/3">
                    <div 
                      className="h-64 md:h-full bg-cover bg-center"
                      style={{ backgroundImage: `url(${event.image})` }}
                    />
                  </div>
                  
                  {/* Event Content */}
                  <div className="md:w-2/3 p-6">
                    <CardHeader className="p-0 mb-4">
                      <div className="flex items-start justify-between mb-2">
                        <CardTitle className="text-2xl font-bold text-foreground">
                          {event.title}
                        </CardTitle>
                        {event.verified && (
                          <Badge variant="secondary" className="ml-2 bg-green-500/20 text-green-400 hover:bg-green-500/30">
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            Verified listing
                          </Badge>
                        )}
                      </div>
                      <p className="text-lg font-semibold text-primary mb-4">
                        {event.subtitle}
                      </p>
                    </CardHeader>

                    <CardContent className="p-0">
                      {/* Event Details */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div className="flex items-center text-muted-foreground">
                          <Calendar className="w-4 h-4 mr-2" />
                          <div>
                            <p className="font-medium">Event date</p>
                            <p className="text-sm">{event.startDate}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center text-muted-foreground">
                          <Calendar className="w-4 h-4 mr-2" />
                          <div>
                            <p className="font-medium">End Date</p>
                            <p className="text-sm">{event.endDate}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center text-muted-foreground">
                          <Clock className="w-4 h-4 mr-2" />
                          <div>
                            <p className="font-medium">Timing</p>
                            <p className="text-sm">{event.timing}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center text-muted-foreground">
                          <MapPin className="w-4 h-4 mr-2" />
                          <div>
                            <p className="font-medium">Location</p>
                            <p className="text-sm">{event.location}</p>
                          </div>
                        </div>
                      </div>

                      {/* Ticket Options */}
                      <div className="space-y-4 mb-6">
                        <h3 className="font-semibold text-foreground">Ticket Options</h3>
                        {event.tickets.map((ticket, index) => (
                          <div key={index} className="flex items-center justify-between p-4 bg-secondary/20 rounded-lg border border-border/30">
                            <div className="flex items-center">
                              <Users className="w-4 h-4 mr-3 text-muted-foreground" />
                              <div>
                                <p className="font-medium text-foreground">{ticket.type}</p>
                                <p className="text-sm text-muted-foreground">{ticket.description}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-primary text-lg">
                                {formatPrice(ticket.price)}
                              </p>
                              {ticket.available && (
                                <Badge variant="outline" className="text-xs border-green-500/30 text-green-400">
                                  Available
                                </Badge>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-3">
                        <Button className="flex-1 bg-primary hover:bg-primary/90">
                          Book Tickets
                        </Button>
                        <Button variant="outline" className="border-border/50 hover:bg-secondary/20">
                          More Info
                        </Button>
                      </div>
                    </CardContent>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Empty State or Loading for more events */}
          <div className="text-center mt-12">
            <p className="text-muted-foreground">
              More exciting events coming soon! Stay tuned for updates.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Events;