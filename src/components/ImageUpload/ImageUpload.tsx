import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload, X, Loader2 } from "lucide-react";
import { ItemPhoto } from "@/types";

interface ImageUploadProps {
  photos: ItemPhoto[];
  onChange: (photos: ItemPhoto[]) => void;
  maxPhotos?: number;
  disabled?: boolean;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  photos,
  onChange,
  maxPhotos = 5,
  disabled = false,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>(
    {}
  );

  const compressImage = async (file: File): Promise<Blob> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          let width = img.width;
          let height = img.height;

          // Max dimensions
          const maxDim = 1920;
          if (width > height) {
            if (width > maxDim) {
              height *= maxDim / width;
              width = maxDim;
            }
          } else {
            if (height > maxDim) {
              width *= maxDim / height;
              height = maxDim;
            }
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext("2d");
          ctx?.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              resolve(blob || file);
            },
            "image/jpeg",
            0.8 // 80% quality
          );
        };
      };
    });
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Check max photos limit
    if (photos.length + files.length > maxPhotos) {
      alert(`Maximum ${maxPhotos} photos allowed`);
      return;
    }

    setUploading(true);

    try {
      const uploadedPhotos = await Promise.all(
        files.map(async (file, index) => {
          const id = `photo_${Date.now()}_${index}`;
          setUploadProgress((prev) => ({ ...prev, [id]: 0 }));

          try {
            // Compress image
            const compressedBlob = await compressImage(file);

            // Simulate upload progress
            for (let i = 0; i <= 100; i += 10) {
              await new Promise((resolve) => setTimeout(resolve, 50));
              setUploadProgress((prev) => ({ ...prev, [id]: i }));
            }

            // Create object URLs for preview
            const url = URL.createObjectURL(compressedBlob);

            return {
              id,
              url,
              size: compressedBlob.size,
              uploadedAt: new Date().toISOString(),
              order: photos.length + index,
            };
          } catch (error) {
            console.error(`Error processing ${file.name}:`, error);
            return null;
          }
        })
      );

      const validPhotos = uploadedPhotos.filter(
        (p) => p !== null
      ) as ItemPhoto[];
      onChange([...photos, ...validPhotos]);

      setUploadProgress({});
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    } finally {
      setUploading(false);
    }
  };

  const removePhoto = (photoId: string) => {
    onChange(photos.filter((p) => p.id !== photoId));
  };

  const movePhoto = (index: number, direction: "up" | "down") => {
    const newPhotos = [...photos];
    const newIndex = direction === "up" ? index - 1 : index + 1;

    if (newIndex >= 0 && newIndex < newPhotos.length) {
      [newPhotos[index], newPhotos[newIndex]] = [
        newPhotos[newIndex],
        newPhotos[index],
      ];
      newPhotos.forEach((photo, idx) => {
        photo.order = idx;
      });
      onChange(newPhotos);
    }
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <Card className="border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors">
        <label className="flex items-center justify-center p-8 cursor-pointer">
          <input
            ref={inputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileSelect}
            disabled={disabled || uploading || photos.length >= maxPhotos}
            className="hidden"
          />
          <div className="text-center">
            {uploading ? (
              <>
                <Loader2 className="w-8 h-8 mx-auto mb-2 text-blue-500 animate-spin" />
                <p className="text-sm font-medium text-gray-700">
                  Uploading...
                </p>
              </>
            ) : (
              <>
                <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm font-medium text-gray-700">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-gray-500">
                  PNG, JPG, GIF up to 10MB ({photos.length}/{maxPhotos})
                </p>
              </>
            )}
          </div>
        </label>
      </Card>

      {/* Photo Gallery */}
      {photos.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {photos.map((photo, index) => (
            <div key={photo.id} className="relative group">
              <Card className="overflow-hidden aspect-square">
                <img
                  src={photo.url}
                  alt={`Photo ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                {uploadProgress[photo.id] !== undefined &&
                  uploadProgress[photo.id] < 100 && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <p className="text-white text-xs">
                        {uploadProgress[photo.id]}%
                      </p>
                    </div>
                  )}
              </Card>

              {/* Action buttons */}
              <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                {index > 0 && (
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => movePhoto(index, "up")}
                    className="text-xs"
                  >
                    ↑
                  </Button>
                )}
                {index < photos.length - 1 && (
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => movePhoto(index, "down")}
                    className="text-xs"
                  >
                    ↓
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => removePhoto(photo.id)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {index === 0 && (
                <div className="absolute top-1 left-1 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                  Cover
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
