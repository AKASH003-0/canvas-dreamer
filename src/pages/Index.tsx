import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Loader2, Sparkles, Wand2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const artStyles = [
  { value: "realistic", label: "Realistic" },
  { value: "comic", label: "Comic" },
  { value: "oil-painting", label: "Oil Painting" },
  { value: "sketch", label: "Sketch" },
  { value: "pencil-art", label: "Pencil Art" },
  { value: "cartoon", label: "Cartoon" },
  { value: "anime", label: "Anime" },
  { value: "watercolor", label: "Watercolor" },
  { value: "digital-art", label: "Digital Art" },
];

const Index = () => {
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState("realistic");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isImageLoading, setIsImageLoading] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a description for your image");
      return;
    }

    setIsGenerating(true);
    setGeneratedImage(null);

    try {
      const { data, error } = await supabase.functions.invoke('generate-image', {
        body: { prompt, style }
      });

      if (error) {
        console.error('Edge function error:', error);
        if (error.message?.includes('429')) {
          toast.error("Rate limit exceeded. Please try again in a moment.");
        } else if (error.message?.includes('402')) {
          toast.error("AI credits exhausted. Please add more credits in Settings.");
        } else {
          toast.error("Failed to generate image. Please try again.");
        }
        return;
      }

      if (data?.image) {
        setIsImageLoading(true);
        setGeneratedImage(data.image);
      } else {
        toast.error("No image was generated. Please try again.");
      }
    } catch (err) {
      console.error('Generate error:', err);
      toast.error("An unexpected error occurred");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-fire relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-lavender rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-pulse" />
        <div className="absolute top-40 right-10 w-96 h-96 bg-red-passion rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-pulse delay-1000" />
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-teal rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-pulse delay-2000" />
      </div>

      {/* Main content */}
      <div className="relative z-10 container mx-auto px-4 py-8 md:py-16">
        {/* Header */}
        <div className="text-center mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 bg-teal/30 backdrop-blur-sm px-4 py-2 rounded-full mb-4 border border-lavender/30">
            <Sparkles className="w-4 h-4 text-red-passion animate-pulse" />
            <span className="text-sm font-semibold text-foreground tracking-wide">AI-POWERED IMAGE GENERATION</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black bg-gradient-primary bg-clip-text text-transparent leading-tight tracking-tight">
            CREATE STUNNING
            <br />
            AI IMAGES
          </h1>
          
          <p className="text-lg md:text-xl text-foreground/70 max-w-2xl mx-auto font-medium">
            Transform your ideas into beautiful artwork with advanced AI technology
          </p>
        </div>

        {/* Main Generator Card */}
        <Card className="max-w-4xl mx-auto p-6 md:p-8 bg-card/95 backdrop-blur-lg shadow-glow border-2 border-lavender/30">
          <div className="space-y-6">
            {/* Prompt Input */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-foreground flex items-center gap-2 uppercase tracking-wider">
                <Wand2 className="w-4 h-4 text-lavender" />
                Describe Your Image
              </label>
              <Textarea
                placeholder="e.g., A serene mountain landscape at sunset with vibrant colors..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="min-h-32 text-base bg-background border-2 border-border focus:border-lavender focus:ring-2 focus:ring-lavender/20 transition-all resize-none font-space"
              />
            </div>

            {/* Style Selector */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-foreground uppercase tracking-wider">Art Style</label>
              <Select value={style} onValueChange={setStyle}>
                <SelectTrigger className="w-full bg-background border-2 border-border hover:border-lavender focus:ring-2 focus:ring-lavender/20 transition-all font-space">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {artStyles.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Generate Button */}
            <Button
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
              className="w-full h-14 text-lg font-black uppercase tracking-wider bg-gradient-primary hover:opacity-90 transition-all shadow-glow hover:shadow-red disabled:opacity-50 border-2 border-lavender/30"
              size="lg"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Generating Magic...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  Generate Image
                </>
              )}
            </Button>
          </div>
        </Card>

        {/* Generated Image Display */}
        {generatedImage && (
          <Card className="max-w-4xl mx-auto mt-8 p-6 bg-card/95 backdrop-blur-lg shadow-glow border-2 border-lavender/30 animate-in fade-in duration-500">
            <div className="space-y-4">
              <h3 className="text-xl font-black text-foreground uppercase tracking-wider">Your Generated Image</h3>
              <div className="relative rounded-lg overflow-hidden shadow-red border-2 border-lavender/20">
                {isImageLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
                    <div className="text-center space-y-3">
                      <Loader2 className="w-12 h-12 animate-spin text-lavender mx-auto" />
                      <p className="text-sm font-bold text-foreground/70 uppercase tracking-wider">Loading image...</p>
                      <p className="text-xs text-foreground/50">This may take 10-30 seconds</p>
                    </div>
                  </div>
                )}
                <img
                  src={generatedImage}
                  alt="Generated artwork"
                  className="w-full h-auto"
                  onLoad={() => {
                    setIsImageLoading(false);
                    toast.success("Image generated successfully!");
                  }}
                  onError={() => {
                    setIsImageLoading(false);
                    toast.error("Failed to load image. Try again.");
                  }}
                />
              </div>
              <Button
                onClick={() => {
                  const link = document.createElement('a');
                  link.href = generatedImage;
                  link.download = `ai-generated-${Date.now()}.png`;
                  link.click();
                  toast.success("Image downloaded!");
                }}
                variant="outline"
                className="w-full h-12 font-bold uppercase tracking-wider border-2 border-lavender hover:bg-lavender hover:text-background transition-all"
                disabled={isImageLoading}
              >
                Download Image
              </Button>
            </div>
          </Card>
        )}

        {/* Watermark */}
        <div className="text-center mt-12 space-y-2">
          <p className="text-sm text-foreground/60 font-medium uppercase tracking-widest">
            Powered by Advanced AI Technology
          </p>
          <p className="text-sm font-black text-foreground flex items-center justify-center gap-2 uppercase tracking-wider">
            <span className="text-red-passion">©</span>
            <span>Created by AKASH</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
