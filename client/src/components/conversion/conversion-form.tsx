import { useState } from "react";
import { motion } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import { Link, Zap, Sliders } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import LoadingSpinner from "@/components/ui/loading-spinner";
import ConversionResult from "./conversion-result";

export default function ConversionForm() {
  const [url, setUrl] = useState("");
  const [quality, setQuality] = useState("128k");
  const [conversionResult, setConversionResult] = useState<any>(null);
  const { toast } = useToast();

  const convertMutation = useMutation({
    mutationFn: async (data: { url: string; quality: string }) => {
      const response = await apiRequest("POST", "/api/convert", data);
      
      if (response.headers.get('content-type')?.includes('audio')) {
        // If the response is audio file, create a download URL
        const blob = await response.blob();
        const downloadUrl = URL.createObjectURL(blob);
        return { 
          success: true, 
          downloadUrl,
          title: `YouTube Audio - ${quality}` 
        };
      } else {
        return await response.json();
      }
    },
    onSuccess: (data) => {
      if (data.success) {
        setConversionResult(data);
        toast({
          title: "Conversion Complete! 🎉",
          description: "Your MP3 is ready for download.",
        });
      } else {
        toast({
          title: "Conversion Failed",
          description: data.error || "An error occurred during conversion.",
          variant: "destructive",
        });
      }
    },
    onError: (error: any) => {
      toast({
        title: "Conversion Failed",
        description: error.message || "Please check the URL and try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) {
      toast({
        title: "URL Required",
        description: "Please enter a YouTube URL.",
        variant: "destructive",
      });
      return;
    }

    setConversionResult(null);
    convertMutation.mutate({ url, quality });
  };

  const handleReset = () => {
    setUrl("");
    setQuality("128k");
    setConversionResult(null);
  };

  if (convertMutation.isPending) {
    return <LoadingSpinner />;
  }

  if (conversionResult) {
    return <ConversionResult result={conversionResult} onReset={handleReset} />;
  }

  return (
    <motion.div 
      className="bg-white rounded-comic p-8 comic-shadow max-w-2xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* URL Input */}
        <div>
          <Label className="block text-lg font-bold text-forest-700 mb-3 font-comic">
            <Link className="text-comic-orange mr-2 inline-block" size={20} />
            Paste YouTube URL
          </Label>
          <div className="relative">
            <Input 
              type="url" 
              placeholder="https://www.youtube.com/watch?v=..." 
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full px-4 py-4 border-3 border-forest-300 rounded-comic focus:border-forest-500 focus:outline-none focus:ring-4 focus:ring-forest-100 font-nunito text-lg transition-all duration-200"
              required
            />
          </div>
        </div>

        {/* Quality Selection */}
        <div>
          <Label className="block text-lg font-bold text-forest-700 mb-3 font-comic">
            <Sliders className="text-comic-orange mr-2 inline-block" size={20} />
            Audio Quality
          </Label>
          <Select value={quality} onValueChange={setQuality}>
            <SelectTrigger className="w-full px-4 py-4 border-3 border-forest-300 rounded-comic focus:border-forest-500 focus:outline-none focus:ring-4 focus:ring-forest-100 font-nunito text-lg bg-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="64k">64 kbps - Small file size</SelectItem>
              <SelectItem value="128k">128 kbps - Good quality</SelectItem>
              <SelectItem value="192k">192 kbps - High quality</SelectItem>
              <SelectItem value="256k">256 kbps - Very high quality</SelectItem>
              <SelectItem value="320k">320 kbps - Premium quality</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Convert Button */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button 
            type="submit"
            className="w-full bg-forest-500 hover:bg-forest-700 text-white font-bold py-6 px-8 rounded-comic comic-button-shadow transition-all duration-200 text-xl font-comic"
            disabled={convertMutation.isPending}
          >
            <span className="flex items-center justify-center">
              <Zap className="text-comic-yellow mr-3" size={24} />
              POW! Convert Now
              <Zap className="text-comic-yellow ml-3" size={24} />
            </span>
          </Button>
        </motion.div>
      </form>
    </motion.div>
  );
}
