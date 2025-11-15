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
        setGeneratedImage(data.image);
        toast.success("Image generated successfully!");
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
    <div className="min-h-screen bg-gradient-primary relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-pink rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
        <div className="absolute top-40 right-10 w-72 h-72 bg-mustard rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000" />
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-tangerine rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-2000" />
      </div>

      {/* Main content */}
      <div className="relative z-10 container mx-auto px-4 py-8 md:py-16">
        {/* Header */}
        <div className="text-center mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 bg-secondary/20 backdrop-blur-sm px-4 py-2 rounded-full mb-4">
            <Sparkles className="w-4 h-4 text-mustard animate-pulse" />
            <span className="text-sm font-medium text-secondary-foreground">AI-Powered Image Generation</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black bg-gradient-warm bg-clip-text text-transparent leading-tight">
            Create Stunning
            <br />
            AI Images
          </h1>
          
          <p className="text-lg md:text-xl text-foreground/80 max-w-2xl mx-auto">
            Transform your ideas into beautiful artwork with advanced AI technology
          </p>
        </div>

        {/* Main Generator Card */}
        <Card className="max-w-4xl mx-auto p-6 md:p-8 bg-card/95 backdrop-blur-lg shadow-glow border-2 border-primary/20">
          <div className="space-y-6">
            {/* Prompt Input */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Wand2 className="w-4 h-4 text-primary" />
                Describe Your Image
              </label>
              <Textarea
                placeholder="e.g., A serene mountain landscape at sunset with vibrant colors..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="min-h-32 text-base bg-background border-2 border-border focus:border-primary transition-all resize-none"
              />
            </div>

            {/* Style Selector */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">Art Style</label>
              <Select value={style} onValueChange={setStyle}>
                <SelectTrigger className="w-full bg-background border-2 border-border hover:border-primary transition-all">
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
              className="w-full h-14 text-lg font-bold bg-gradient-warm hover:opacity-90 transition-all shadow-warm hover:shadow-glow disabled:opacity-50"
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
          <Card className="max-w-4xl mx-auto mt-8 p-6 bg-card/95 backdrop-blur-lg shadow-glow border-2 border-primary/20 animate-in fade-in duration-500">
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-foreground">Your Generated Image</h3>
              <div className="relative rounded-lg overflow-hidden shadow-warm">
                <img
                  src={generatedImage}
                  alt="Generated artwork"
                  className="w-full h-auto"
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
                className="w-full border-2 border-primary hover:bg-primary hover:text-primary-foreground transition-all"
              >
                Download Image
              </Button>
            </div>
          </Card>
        )}

        {/* Watermark */}
        <div className="text-center mt-12 space-y-2">
          <p className="text-sm text-foreground/60">
            Powered by Advanced AI Technology
          </p>
          <p className="text-xs font-semibold text-foreground/80 flex items-center justify-center gap-2">
            <span className="text-primary">©</span>
            <span>Created by AKASH</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
