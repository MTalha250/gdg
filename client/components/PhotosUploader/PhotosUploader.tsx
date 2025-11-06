import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import imageCompression from "browser-image-compression";
import React from "react";

const CLOUDINARY_UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

export default function PhotosUploader({
  addedPhotos,
  onChange,
  maxPhotos = 1,
}: {
  addedPhotos: string[];
  maxPhotos: number;
  onChange: (photos: string[]) => void;
}) {
  const [isUploading, setIsUploading] = useState(false);

  const uploadSingleImage = async (file: any) => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", CLOUDINARY_UPLOAD_PRESET!);

    const res = await axios.post(CLOUDINARY_UPLOAD_URL, data);
    return res.data.secure_url;
  };

  const validateFiles = (files: any) => {
    const MAX_FILE_SIZE = 7 * 1024 * 1024;

    if (files.length + addedPhotos.length > maxPhotos) {
      throw new Error(`Only ${maxPhotos} photo allowed`);
    }

    for (let i = 0; i < files.length; i++) {
      if (files[i].size > MAX_FILE_SIZE) throw new Error("File too large (max 7MB)");
      if (!files[i].type.startsWith("image/")) throw new Error("Invalid image file");
    }
  };

  const compressImage = async (file: any) => {
    try {
      return await imageCompression(file, {
        maxSizeMB: 3,
        maxWidthOrHeight: 2000,
      });
    } catch {
      return file;
    }
  };

  const handleImageUpload = async (e: any) => {
    setIsUploading(true);
    try {
      const files = e.target.files;
      validateFiles(files);

      const compressed = await compressImage(files[0]);
      const url = await uploadSingleImage(compressed);

      toast.success("Receipt uploaded ✅");
      onChange([url]); 
    } catch (error: any) {
      toast.error(error.message || "Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const removePhoto = (e: any, link: string) => {
    e.preventDefault();
    onChange([]);
  };

  return (
    <div className="mt-2 w-full">
      <div className="flex flex-wrap gap-4">
        {addedPhotos.length > 0 && (
          <div className="relative">
            <img className="h-24 w-24 object-cover rounded-lg border" src={addedPhotos[0]} alt="receipt" />
            <button
              type="button"
              onClick={(e) => removePhoto(e, addedPhotos[0])}
              className="absolute right-1 top-1 bg-red-600 text-white text-xs px-2 py-1 rounded"
            >
              X
            </button>
          </div>
        )}

        {addedPhotos.length === 0 && (
          <label
            className={`flex h-24 w-24 cursor-pointer items-center justify-center border-2 border-dashed border-gray-400 bg-gray-100 hover:bg-black-200 rounded-lg transition-colors text-sm ${
              isUploading ? "animate-pulse pointer-events-none" : ""
            }`}
          >
            <input
              type="file"
              disabled={isUploading}
              className="hidden"
              accept="image/*"
              onChange={handleImageUpload}
            />
            <span className="text-black">
              {isUploading ? "Uploading..." : "Upload"}
            </span>

          </label>
        )}
      </div>
    </div>
  );
}
