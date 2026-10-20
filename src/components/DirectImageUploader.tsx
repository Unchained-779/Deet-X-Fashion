"use client";

import { useState, useRef } from "react";
import { Camera, Upload, Check, X, Image as ImageIcon } from "lucide-react";

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
}

export default function DirectImageUploader({ value, onChange }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string>(value || "");
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok && data.url) {
        setPreview(data.url);
        onChange(data.url);
      } else {
        setError(data.error || "Failed to upload photo");
      }
    } catch {
      setError("Unable to connect to upload service");
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setPreview("");
    onChange("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-slate-800">
        Garment Photo (कपड़े की फोटो)
      </label>

      {/* Hidden file input supporting camera capture & gallery files */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        id="garment-photo-input"
      />

      {preview ? (
        <div className="relative border-2 border-dashed border-[#E5E0D8] bg-surface p-4 flex flex-col items-center justify-center max-w-sm">
          <div className="relative aspect-[3/4] w-48 overflow-hidden border border-[#E5E0D8] bg-white">
            <img
              src={preview}
              alt="Uploaded Garment Preview"
              className="w-full h-full object-cover object-top"
            />
          </div>

          <div className="flex items-center gap-3 mt-4">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 bg-slate-900 text-white text-xs font-medium rounded-none hover:bg-neutral-800 transition-colors flex items-center gap-1.5"
            >
              <Camera className="w-3.5 h-3.5" /> Change Photo (फोटो बदलें)
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="px-3 py-1.5 border border-red-200 text-red-600 text-xs font-medium rounded-none hover:bg-red-50 transition-colors flex items-center gap-1.5"
            >
              <X className="w-3.5 h-3.5" /> Remove
            </button>
          </div>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-300 hover:border-slate-900 bg-slate-50 hover:bg-slate-100/70 p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-colors max-w-sm"
        >
          {uploading ? (
            <div className="space-y-2">
              <div className="w-8 h-8 border-2 border-slate-900 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs font-medium text-slate-700">Uploading photo...</p>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="w-12 h-12 bg-white border border-slate-200 flex items-center justify-center mx-auto text-slate-700">
                <Camera className="w-6 h-6 stroke-[1.5]" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  Tap to Take Photo or Select from Mobile
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  (मोबाइल से फोटो खींचें या गैलरी से चुनें)
                </p>
              </div>
              <span className="inline-block mt-2 px-3 py-1 bg-slate-900 text-white text-[11px] font-medium tracking-wide">
                Choose Photo
              </span>
            </div>
          )}
        </div>
      )}

      {error && (
        <p className="text-xs text-red-600 font-medium">{error}</p>
      )}

      {/* Manual URL input kept as an optional fallback */}
      <div className="pt-2">
        <details className="text-xs text-slate-400 cursor-pointer">
          <summary>Or paste an image URL (optional)</summary>
          <input
            type="text"
            value={value}
            onChange={(e) => {
              setPreview(e.target.value);
              onChange(e.target.value);
            }}
            placeholder="https://..."
            className="w-full mt-2 p-2 border border-slate-200 text-slate-800 text-xs focus:outline-none"
          />
        </details>
      </div>
    </div>
  );
}
