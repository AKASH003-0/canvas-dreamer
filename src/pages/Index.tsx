import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Loader2, Sparkles, Wand2, Clock, Zap } from "lucide-react";
import { toast } from "sonner";

const artStyles = [
  { value: "realistic", label: "Realistic", modifier: "photorealistic, highly detailed, professional photography, 8k" },
  { value: "comic", label: "Comic", modifier: "comic book style, bold lines, vibrant colors, graphic novel art" },
  { value: "oil-painting", label: "Oil Painting", modifier: "oil painting style, brush strokes, classical art, museum quality" },
  { value: "sketch", label: "Sketch", modifier: "pencil sketch, hand-drawn, artistic sketch, black and white line art" },
  { value: "pencil-art", label: "Pencil Art", modifier: "detailed pencil drawing, graphite art, realistic shading" },
  { value: "cartoon", label: "Cartoon", modifier: "cartoon style, animated, colorful, fun illustration" },
  { value: "anime", label: "Anime", modifier: "anime style, manga art, Japanese animation style" },
  { value: "watercolor", label: "Watercolor", modifier: "watercolor painting, soft colors, artistic, flowing paint" },
  { value: "digital-art", label: "Digital Art", modifier: "digital art, modern illustration, contemporary style" },
];

const Index = () => {
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState("realistic");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);

  // Timer effect for loading state
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isImageLoading) {
      setElapsedTime(0);
      interval = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isImageLoading]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a description for your image");
      return;
    }

    setIsGenerating(true);
    setGeneratedImage(null);
    setIsImageLoading(true);

    try {
      const selectedStyle = artStyles.find(s => s.value === style);
      const enhancedPrompt = `${prompt.trim()}, ${selectedStyle?.modifier || ''}`;
      
      // Direct Pollinations.ai URL - FREE, UNLIMITED, NO API KEY
      const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(enhancedPrompt)}?model=flux&width=1024&height=1024&nologo=true&seed=${Date.now()}`;
      
      setGeneratedImage(imageUrl);
    } catch (err) {
      console.error('Generate error:', err);
      toast.error("An unexpected error occurred");
      setIsImageLoading(false);
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
                  <div className="absolute inset-0 flex items-center justify-center bg-background/90 z-10 backdrop-blur-sm">
                    <div className="text-center space-y-6 p-8">
                      {/* Animated rings */}
                      <div className="relative w-32 h-32 mx-auto">
                        <div className="absolute inset-0 rounded-full border-4 border-lavender/20 animate-ping" />
                        <div className="absolute inset-2 rounded-full border-4 border-teal/30 animate-pulse" />
                        <div className="absolute inset-4 rounded-full border-4 border-red-passion/40 animate-spin" style={{ animationDuration: '3s' }} />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center">
                            <Clock className="w-8 h-8 text-lavender mx-auto mb-1 animate-pulse" />
                            <span className="text-2xl font-black text-foreground tabular-nums tracking-wider">
                              {formatTime(elapsedTime)}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Status text */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-center gap-2">
                          <Zap className="w-4 h-4 text-red-passion animate-pulse" />
                          <p className="text-lg font-black text-foreground uppercase tracking-wider">
                            AI Magic in Progress
                          </p>
                          <Zap className="w-4 h-4 text-red-passion animate-pulse" />
                        </div>
                        <p className="text-sm text-foreground/60 font-medium">
                          Creating your masterpiece • Usually 10-30 seconds
                        </p>
                        
                        {/* Progress bar */}
                        <div className="w-64 mx-auto h-2 bg-background rounded-full overflow-hidden border border-lavender/30">
                          <div 
                            className="h-full bg-gradient-to-r from-lavender via-red-passion to-teal animate-pulse"
                            style={{ 
                              width: `${Math.min((elapsedTime / 30) * 100, 100)}%`,
                              transition: 'width 1s ease-out'
                            }}
                          />
                        </div>
                      </div>
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
