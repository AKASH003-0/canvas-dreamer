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
  'realistic': 'photorealistic, highly detailed, professional photography, ultra high resolution',
  'comic': 'comic book style, bold lines, vibrant colors, graphic novel art, ultra high resolution',
  'oil-painting': 'oil painting style, brush strokes, classical art, museum quality, ultra high resolution',
  'sketch': 'pencil sketch, hand-drawn, artistic sketch, black and white line art, ultra high resolution',
  'pencil-art': 'detailed pencil drawing, graphite art, realistic shading, fine art, ultra high resolution',
  'cartoon': 'cartoon style, animated, colorful, fun illustration, ultra high resolution',
  'anime': 'anime style, manga art, Japanese animation style, ultra high resolution',
  'watercolor': 'watercolor painting, soft colors, artistic, flowing paint, ultra high resolution',
  'digital-art': 'digital art, modern illustration, contemporary style, ultra high resolution',
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

    // Enhance prompt with style modifier
    const styleModifier = styleModifiers[style] || styleModifiers['realistic'];
    const enhancedPrompt = `${prompt}, ${styleModifier}`;

    console.log('Generating image with Pollinations.ai FLUX:', enhancedPrompt);

    // Use Pollinations.ai - completely free, no API key needed
    // Return the URL directly - client will load the image
    const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(enhancedPrompt)}?model=flux&width=1024&height=1024&nologo=true&enhance=true&seed=${Date.now()}`;

    console.log('Generated Pollinations URL:', imageUrl);

    return new Response(
      JSON.stringify({ image: imageUrl }),
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
