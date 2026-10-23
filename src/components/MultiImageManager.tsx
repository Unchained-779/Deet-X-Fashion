"use client";

import { useState, useRef } from "react";
import { Camera, Upload, Check, X, Image as ImageIcon, ArrowLeftRight, Link2, Plus } from "lucide-react";

export interface ImageSlot {
  id: string;
  url: string;
  label: "Primary Front View" | "Hover / Back View" | "Fabric Close-up" | "Model Look";
}

interface MultiImageManagerProps {
  images: string[];
  onChange: (images: string[]) => void;
}

const DEFAULT_SLOT_LABELS: ("Primary Front View" | "Hover / Back View" | "Fabric Close-up" | "Model Look")[] = [
  "Primary Front View",
  "Hover / Back View",
  "Fabric Close-up",
  "Model Look",
];

export default function MultiImageManager({ images, onChange }: MultiImageManagerProps) {
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const [directUrl, setDirectUrl] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [targetSlotIndex, setTargetSlotIndex] = useState<number>(0);

  // Client-side lightweight image compressor to keep payload small and fast
  const compressImage = (file: File): Promise<Blob> => {
    return new Promise((resolve) => {
      // If it's already tiny (< 300KB), return as is
      if (file.size < 300 * 1024) {
        return resolve(file);
      }

      const img = new Image();
      const objectUrl = URL.createObjectURL(file);
      img.src = objectUrl;

      img.onload = () => {
        URL.revokeObjectURL(objectUrl);
        const maxDim = 1200;
        let { width, height } = img;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) return resolve(file);

        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) => {
            if (blob && blob.size < file.size) {
              resolve(blob);
            } else {
              resolve(file);
            }
          },
          "image/jpeg",
          0.82
        );
      };

      img.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        resolve(file);
      };
    });
  };

  const handleUploadFile = async (e: React.ChangeEvent<HTMLInputElement>, slotIdx: number) => {
    const rawFile = e.target.files?.[0];
    if (!rawFile) return;

    setUploadingIndex(slotIdx);
    try {
      const processedBlob = await compressImage(rawFile);
      const formData = new FormData();
      formData.append("file", processedBlob, rawFile.name || "garment.jpg");

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.url) {
        const nextImages = [...images];
        nextImages[slotIdx] = data.url;
        onChange(nextImages.filter(Boolean));
      } else {
        alert(data.error || "Failed to upload photo");
      }
    } catch (err) {
      alert("Error connecting to upload service. Please try again.");
    } finally {
      setUploadingIndex(null);
      e.target.value = "";
    }
  };

  const handleAddDirectUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!directUrl.trim()) return;

    const next = [...images, directUrl.trim()];
    onChange(next);
    setDirectUrl("");
  };

  const handleRemoveImage = (index: number) => {
    const next = images.filter((_, idx) => idx !== index);
    onChange(next);
  };

  const handleMove = (from: number, to: number) => {
    if (to < 0 || to >= images.length) return;
    const next = [...images];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    onChange(next);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
        <div>
          <label className="block text-sm font-bold text-slate-900">
            Multi-Image Fashion Showcase (तस्वीरें)
          </label>
          <p className="text-xs text-slate-500">
            Upload Front, Back, Fabric Close-up, and Model views. First image serves as the Primary Catalog Cover.
          </p>
        </div>
        <span className="text-xs font-mono bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full font-semibold">
          {images.length} Images Uploaded
        </span>
      </div>

      {/* Grid of Image Slots */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[0, 1, 2, 3].map((slotIdx) => {
          const imgUrl = images[slotIdx];
          const label = DEFAULT_SLOT_LABELS[slotIdx];
          const isPrimary = slotIdx === 0;

          return (
            <div
              key={slotIdx}
              className={`relative rounded-xl border-2 transition-all flex flex-col justify-between overflow-hidden bg-slate-50 ${
                isPrimary
                  ? "border-amber-400/80 shadow-sm"
                  : imgUrl
                  ? "border-slate-300"
                  : "border-dashed border-slate-300 hover:border-slate-400"
              }`}
            >
              {/* Badge for slot */}
              <div className="p-2 border-b border-slate-200/80 bg-white/80 flex items-center justify-between text-[10px] font-mono font-semibold">
                <span className={isPrimary ? "text-amber-700 font-bold" : "text-slate-600"}>
                  {label}
                </span>
                {imgUrl && (
                  <div className="flex items-center gap-1">
                    {slotIdx > 0 && (
                      <button
                        type="button"
                        onClick={() => handleMove(slotIdx, slotIdx - 1)}
                        title="Move Left"
                        className="p-0.5 hover:bg-slate-100 rounded text-slate-600"
                      >
                        ◀
                      </button>
                    )}
                    {slotIdx < images.length - 1 && (
                      <button
                        type="button"
                        onClick={() => handleMove(slotIdx, slotIdx + 1)}
                        title="Move Right"
                        className="p-0.5 hover:bg-slate-100 rounded text-slate-600"
                      >
                        ▶
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Image Preview / Empty Upload Area */}
              <div className="aspect-[3/4] relative flex items-center justify-center p-2 bg-white">
                {uploadingIndex === slotIdx ? (
                  <div className="space-y-2 text-center">
                    <div className="w-6 h-6 border-2 border-slate-900 border-t-transparent rounded-full animate-spin mx-auto" />
                    <span className="text-[10px] font-mono text-slate-500">Uploading...</span>
                  </div>
                ) : imgUrl ? (
                  <div className="relative w-full h-full group">
                    <img
                      src={imgUrl}
                      alt={label}
                      className="w-full h-full object-cover object-top rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(slotIdx)}
                      className="absolute top-1.5 right-1.5 bg-rose-600 hover:bg-rose-700 text-white p-1 rounded-full shadow-md transition-colors"
                      title="Remove Image"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <label className="w-full h-full flex flex-col items-center justify-center text-center cursor-pointer p-3 group">
                    <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-600 group-hover:bg-slate-200 flex items-center justify-center transition-colors mb-2">
                      <Camera className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-semibold text-slate-700">Choose File</span>
                    <span className="text-[10px] text-slate-400 mt-0.5">JPG, PNG, WebP</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleUploadFile(e, slotIdx)}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {/* Slot footer status */}
              <div className="p-1.5 bg-slate-100/60 text-center border-t border-slate-200/60">
                {imgUrl ? (
                  <span className="text-[10px] text-emerald-700 font-mono font-medium flex items-center justify-center gap-1">
                    <Check className="w-3 h-3" /> Ready
                  </span>
                ) : (
                  <span className="text-[10px] text-slate-400 font-mono">Empty Slot</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Direct Image URL input */}
      <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex flex-col sm:flex-row items-center gap-2">
        <div className="flex items-center gap-2 text-slate-500 text-xs font-mono shrink-0">
          <Link2 className="w-4 h-4 text-slate-600" />
          <span>Or add direct image URL:</span>
        </div>
        <form onSubmit={handleAddDirectUrl} className="flex-1 flex gap-2 w-full">
          <input
            type="url"
            value={directUrl}
            onChange={(e) => setDirectUrl(e.target.value)}
            placeholder="https://images.unsplash.com/photo-..."
            className="flex-1 px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-mono text-slate-800 focus:outline-none focus:border-slate-800"
          />
          <button
            type="submit"
            disabled={!directUrl.trim()}
            className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-mono font-semibold rounded-lg flex items-center gap-1 disabled:opacity-50"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        </form>
      </div>
    </div>
  );
}
