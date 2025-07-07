import { useState } from "react";
import { motion } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import { Link, Zap, Sliders, Music } from "lucide-react";
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
        // Extract title from content-disposition header if available
        const contentDisposition = response.headers.get('content-disposition');
        let title = `YouTube Audio - ${data.quality}`;
        if (contentDisposition) {
          const titleMatch = contentDisposition.match(/filename="(.+\.mp3)"/);
          if (titleMatch) {
            title = titleMatch[1].replace('.mp3', '');
          }
        }
        return { 
          success: true, 
          downloadUrl,
          title 
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
        setConversionResult({
          success: false,
          error: data.error || "An error occurred during conversion.",
          details: data.details
        });
      }
    },
    onError: (error: any) => {
      setConversionResult({
        success: false,
        error: error.message || "Please check the URL and try again."
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
      className="bg-white rounded-comic p-8 comic-shadow max-w-2xl mx-auto border-2 border-black"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* URL Input */}
        <div>
          <Label className="flex items-center text-lg font-bold text-forest-700 mb-3 font-comic">
            <span className="w-8 h-8 bg-orange-200 rounded-full flex items-center justify-center mr-3">
              <Link className="text-orange-800 w-4 h-4" />
            </span>
            Paste YouTube URL
          </Label>
          <div className="relative">
            <Input 
              type="url" 
              placeholder="https://www.youtube.com/watch?v=..." 
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full px-4 py-4 border-3 border-forest-300 rounded-comic focus:border-forest-500 focus:outline-none focus:ring-4 focus:ring-forest-100 font-nunito text-4xl transition-all duration-200 h-16"
              required
            />
          </div>
        </div>

        {/* Quality Selection */}
        <div>
          <Label className="flex items-center text-lg font-bold text-forest-700 mb-3 font-comic">
            <span className="w-8 h-8 bg-blue-200 rounded-full flex items-center justify-center mr-3">
              <Sliders className="text-blue-800 w-4 h-4" />
            </span>
            Audio Quality
          </Label>
          <Select value={quality} onValueChange={setQuality}>
            <SelectTrigger className="w-full px-4 py-4 border-3 border-forest-300 rounded-comic focus:border-forest-500 focus:outline-none focus:ring-4 focus:ring-forest-100 font-nunito text-lg bg-white h-16">
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
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-6 px-8 rounded-comic comic-button-shadow transition-all duration-200 text-xl font-comic border-2 border-green-800"
            disabled={convertMutation.isPending}
          >
            <>
              <Music className="text-white w-5 h-5" />
              <span className="font-bold text-white">Convert</span>
            </>
          </Button>
        </motion.div>
      </form>
    </motion.div>
  );
}