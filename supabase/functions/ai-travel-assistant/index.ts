import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.2';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, sessionId, userEmail } = await req.json();
    
    console.log('Received message:', message);
    console.log('Session ID:', sessionId);

    // Create Supabase client
    const supabase = createClient(supabaseUrl!, supabaseServiceKey!);

    // Get travel context from database
    const { data: destinations } = await supabase
      .from('destinations')
      .select('*')
      .eq('featured', true);

    const { data: itineraries } = await supabase
      .from('itineraries')
      .select('*')
      .eq('featured', true);

    const { data: attractions } = await supabase
      .from('attractions')
      .select('*');

    // Prepare context for AI
    const travelContext = {
      destinations: destinations || [],
      itineraries: itineraries || [],
      attractions: attractions || []
    };

    const systemPrompt = `You are XTSY Travel Assistant, a helpful AI guide specializing in Northeast India travel, particularly Meghalaya and Assam. You help travelers plan trips, find accommodations, and discover attractions.

Available destinations: ${travelContext.destinations.map(d => `${d.name}, ${d.state}: ${d.description}`).join('; ')}

Available itineraries: ${travelContext.itineraries.map(i => `${i.title} (${i.duration_days} days): ${i.description}`).join('; ')}

Key attractions: ${travelContext.attractions.map(a => `${a.name} (${a.type}): ${a.description}`).join('; ')}

Guidelines:
- Be friendly, knowledgeable, and enthusiastic about Northeast India
- Provide specific recommendations based on available data
- Include practical travel tips and local insights
- Suggest booking accommodations through XTSY when relevant
- If asked about bookings, mention our secure booking system
- Keep responses conversational and helpful
- Use emojis appropriately to make responses engaging`;

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    // Save conversation to database
    try {
      // Check if conversation exists
      const { data: existingConversation } = await supabase
        .from('chat_conversations')
        .select('*')
        .eq('session_id', sessionId)
        .single();

      const messages = existingConversation?.messages || [];
      const updatedMessages = [
        ...messages,
        { role: 'user', content: message, timestamp: new Date().toISOString() },
        { role: 'assistant', content: aiResponse, timestamp: new Date().toISOString() }
      ];

      if (existingConversation) {
        await supabase
          .from('chat_conversations')
          .update({ 
            messages: updatedMessages,
            updated_at: new Date().toISOString()
          })
          .eq('session_id', sessionId);
      } else {
        await supabase
          .from('chat_conversations')
          .insert({
            session_id: sessionId,
            user_email: userEmail,
            messages: updatedMessages
          });
      }
    } catch (dbError) {
      console.error('Database error:', dbError);
      // Continue even if DB save fails
    }

    return new Response(JSON.stringify({ 
      response: aiResponse,
      suggestions: [
        "Tell me about Meghalaya destinations",
        "Plan a 7-day Northeast India trip",
        "What are the best places in Shillong?",
        "Book accommodation for my trip"
      ]
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in AI travel assistant:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to get AI response',
      response: "I'm sorry, I'm having trouble responding right now. Please try again in a moment! 😊"
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});