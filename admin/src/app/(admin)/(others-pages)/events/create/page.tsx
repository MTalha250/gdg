"use client";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import InputField from "@/components/form/input/InputField";
import TextArea from "@/components/form/input/TextArea";
import Button from "@/components/ui/button/Button";
import PhotosUploader from "@/components/photosUploader";
import { useRouter } from "next/navigation";
import { useState } from "react";
import axios from "axios";
import useAuthStore from "@/store/authStore";
import toast from "react-hot-toast";

const CreateEvent = () => {
  const router = useRouter();
  const { token } = useAuthStore();
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    images: [] as string[],
  });
  
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTextAreaChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      description: value
    }));
  };

  const handleImagesChange = (images: string[]) => {
    setFormData(prev => ({
      ...prev,
      images
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.error("Event title is required");
      return;
    }
    
    if (!formData.description.trim()) {
      toast.error("Event description is required");
      return;
    }
    
    if (formData.images.length === 0) {
      toast.error("At least one image is required");
      return;
    }

    try {
      setLoading(true);
      
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/event`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      
      toast.success("Event created successfully");
      router.push("/events");
    } catch (error: any) {
      console.error("Error creating event:", error);
      toast.error(error.response?.data?.message || "Failed to create event");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageBreadcrumb pageTitle="Create Event" />
      <div className="space-y-6">
        <ComponentCard title="Event Information">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Event Title *
              </label>
              <InputField
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter event title"
                disabled={loading}
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Event Description *
              </label>
              <TextArea
                value={formData.description}
                onChange={handleTextAreaChange}
                placeholder="Enter detailed event description"
                rows={6}
                disabled={loading}
              />
            </div>

            {/* Images */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Event Images *
              </label>
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                Upload high-quality images that represent your event. The first image will be used as the main image.
              </div>
              <PhotosUploader
                addedPhotos={formData.images}
                onChange={handleImagesChange}
                maxPhotos={15}
              />
              {formData.images.length === 0 && (
                <p className="text-sm text-red-500 mt-2">
                  At least one image is required
                </p>
              )}
            </div>

            {/* Submit Buttons */}
            <div className="flex items-center gap-4 pt-6">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Creating..." : "Create Event"}
              </button>
              
              <Button
                onClick={() => router.push("/events")}
                disabled={loading}
                variant="outline"
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300"
              >
                Cancel
              </Button>
            </div>
          </form>
        </ComponentCard>
      </div>
    </>
  );
};

export default CreateEvent;
