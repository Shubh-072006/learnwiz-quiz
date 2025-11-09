import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text } = await req.json();
    
    if (!text || text.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: 'Text is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');
    if (!lovableApiKey) {
      console.error('LOVABLE_API_KEY is not configured');
      return new Response(
        JSON.stringify({ error: 'Lovable API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Generating quiz for text of length:', text.length);

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lovableApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant that creates multiple-choice quiz questions from educational content. Generate questions that test understanding of key concepts. Return ONLY valid JSON with no additional text or markdown.'
          },
          {
            role: 'user',
            content: `Create 10 multiple-choice questions based on the following text. Each question should have 4 options with only one correct answer. Format your response as a JSON object with this exact structure:
{
  "quiz": {
    "questions": [
      {
        "id": 1,
        "question": "Question text here?",
        "options": ["Option A", "Option B", "Option C", "Option D"],
        "correctAnswer": 0,
        "difficulty": "medium",
        "explanation": "Brief explanation of the answer",
        "topic": "Topic name"
      }
    ]
  }
}

Text to create quiz from:
${text}`
          }
        ],
        max_completion_tokens: 3000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Lovable AI API error:', response.status, errorText);
      return new Response(
        JSON.stringify({ error: 'Failed to generate quiz' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    let quizContent = data.choices[0].message.content;

    console.log('Raw quiz response:', quizContent);

    // Clean up the response - remove markdown code blocks if present
    quizContent = quizContent.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

    try {
      const quiz = JSON.parse(quizContent);
      console.log('Quiz generated successfully with', quiz.quiz?.questions?.length || 0, 'questions');
      
      return new Response(
        JSON.stringify(quiz),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } catch (parseError) {
      console.error('Failed to parse quiz JSON:', parseError);
      console.error('Attempted to parse:', quizContent);
      return new Response(
        JSON.stringify({ error: 'Failed to parse quiz response' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error('Error in quiz function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
