
import { ChangeEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UploadCloud, X, Image, FileX, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  onFileSelected: (file: File) => void;
  onClear: () => void;
  currentImage?: string;
  className?: string;
}

export function FileUpload({ onFileSelected, onClear, currentImage, className }: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    // Check if file is an image
    if (!file.type.match('image.*')) {
      return;
    }
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setPreviewUrl(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
    
    setFile(file);
    onFileSelected(file);
  };

  const clearSelection = () => {
    setPreviewUrl(null);
    setFile(null);
    onClear();
  };

  return (
    <div className={cn("w-full", className)}>
      {!previewUrl && !currentImage ? (
        <div
          className={cn(
            "border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center gap-3 bg-muted/30 transition-colors",
            dragActive && "border-primary bg-primary/5",
            "hover:border-primary/60 hover:bg-muted/50"
          )}
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
        >
          <UploadCloud className="h-10 w-10 text-muted-foreground" />
          <p className="text-sm text-muted-foreground text-center">
            Drag and drop an image, or click to browse
          </p>
          <Input 
            type="file" 
            className="hidden" 
            id="file-upload" 
            accept="image/*"
            onChange={handleChange}
          />
          <Button variant="outline" asChild>
            <label htmlFor="file-upload" className="cursor-pointer">
              Choose File
            </label>
          </Button>
        </div>
      ) : (
        <div className="relative aspect-video rounded-lg overflow-hidden border border-border">
          <img 
            src={previewUrl || currentImage} 
            alt="Preview" 
            className="w-full h-full object-cover"
          />
          <div className="absolute top-2 right-2 flex gap-2">
            <Button 
              variant="destructive" 
              size="icon" 
              className="h-8 w-8 rounded-full opacity-80 hover:opacity-100"
              onClick={clearSelection}
            >
              <X className="h-4 w-4" />
            </Button>
            {file && (
              <Button 
                variant="secondary" 
                size="icon" 
                className="h-8 w-8 rounded-full opacity-80 hover:opacity-100"
              >
                <Check className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
