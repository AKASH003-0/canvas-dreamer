import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RequestBody {
  prompt: string;
  style: string;
}

const styleModifiers: Record<string, string> = {
  'realistic': 'photorealistic, highly detailed, professional photography',
  'comic': 'comic book style, bold lines, vibrant colors, graphic novel art',
  'oil-painting': 'oil painting style, brush strokes, classical art, museum quality',
  'sketch': 'pencil sketch, hand-drawn, artistic sketch, black and white line art',
  'pencil-art': 'detailed pencil drawing, graphite art, realistic shading, fine art',
  'cartoon': 'cartoon style, animated, colorful, fun illustration',
  'anime': 'anime style, manga art, Japanese animation style',
  'watercolor': 'watercolor painting, soft colors, artistic, flowing paint',
  'digital-art': 'digital art, modern illustration, contemporary style',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt, style }: RequestBody = await req.json();

    if (!prompt || !prompt.trim()) {
      return new Response(
        JSON.stringify({ error: 'Prompt is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const HUGGING_FACE_TOKEN = Deno.env.get('HUGGING_FACE_ACCESS_TOKEN');
    if (!HUGGING_FACE_TOKEN) {
      console.error('HUGGING_FACE_ACCESS_TOKEN is not configured');
      return new Response(
        JSON.stringify({ error: 'AI service not configured' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Enhance prompt with style modifier
    const styleModifier = styleModifiers[style] || styleModifiers['realistic'];
    const enhancedPrompt = `${prompt}, ${styleModifier}`;

    console.log('Generating image with Hugging Face FLUX model via router:', enhancedPrompt);

    const endpoint = 'https://router.huggingface.co/hf-inference/models/black-forest-labs/FLUX.1-schnell';

    const hfResponse = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${HUGGING_FACE_TOKEN}`,
        'Content-Type': 'application/json',
        'Accept': 'image/png'
      },
      body: JSON.stringify({ inputs: enhancedPrompt })
    });

    if (!hfResponse.ok) {
      const errorText = await hfResponse.text();
      console.error('Hugging Face error:', hfResponse.status, errorText);
      const status = hfResponse.status === 429 ? 429 : 500;
      const errMsg = hfResponse.status === 429
        ? 'Rate limit exceeded by Hugging Face. Please try again later.'
        : 'Failed to generate image via Hugging Face';
      return new Response(
        JSON.stringify({ error: errMsg, details: errorText }),
        {
          status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const arrayBuffer = await hfResponse.arrayBuffer();
    const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));

    return new Response(
      JSON.stringify({ image: `data:image/png;base64,${base64}` }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-image function:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'An unexpected error occurred' 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
