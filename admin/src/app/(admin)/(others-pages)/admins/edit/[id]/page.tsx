"use client";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import React, { useState, useEffect } from 'react';
import ComponentCard from '@/components/common/ComponentCard';
import Label from '@/components/form/Label';
import Input from '@/components/form/input/InputField';
import ProfilePicUploader from "@/components/profilePicUploader";
import toast from "react-hot-toast";
import axios from "axios";
import { useRouter, useParams } from "next/navigation";
import useAuthStore from "@/store/authStore";
import { Admin } from "@/types";

interface ValidationState {
  name: boolean;
  username: boolean;
}

interface AdminFormData {
  _id: string;
  name: string;
  username: string;
  profileImage: string;
}

const EditAdmin = () => {
  const [loading, setLoading] = useState(false);
  const [fetchingAdmin, setFetchingAdmin] = useState(true);
  const router = useRouter();
  const {token} = useAuthStore();
  const {id} = useParams();
  
  const [admin, setAdmin] = useState<AdminFormData>({
    _id: "",
    name: "",
    username: "",
    profileImage: "",
  });
  
  const [errors, setErrors] = useState<Partial<Record<keyof AdminFormData, string>>>({});
  
  const [validation, setValidation] = useState<ValidationState>({
    name: false,
    username: false,
  });

  const fetchAdminData = async () => {
    try {
      setFetchingAdmin(true);
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/admin/${id}`,{
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const adminData = response.data;
      
      // Set admin data
      setAdmin({
        _id: adminData._id || "",
        name: adminData.name || "",
        username: adminData.username || "",
        profileImage: adminData.profileImage || "",
      });
      
      // Set validation state for fetched fields
      setValidation({
        name: !!adminData.name,
        username: !!adminData.username,
      });
    } catch (error) {
      console.error("Error fetching admin data:", error);
      toast.error("Failed to fetch admin data");
    } finally {
      setFetchingAdmin(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchAdminData();
    }
  }, [id, token]);

  const validateField = (name: keyof AdminFormData, value: string): boolean => {
    let isValid = true;
    let errorMessage = "";
    
    switch (name) {
      case "username":
        isValid = /^[a-zA-Z0-9._-]{3,}$/.test(value);
        errorMessage = isValid ? "" : "Username must be at least 3 characters and contain only letters, numbers, dots, underscores, or hyphens";
        break;
      case "name":
        isValid = value.trim().length >= 2;
        errorMessage = isValid ? "" : "Name must be at least 2 characters";
        break;
      case "_id":
      case "profileImage":
        return true;
      default:
        isValid = value.trim() !== "";
        errorMessage = isValid ? "" : `${name} is required`;
    }
    
    setErrors(prev => ({ ...prev, [name]: errorMessage }));
    if (name in validation) {
      setValidation(prev => ({ ...prev, [name]: isValid }));
    }
    
    return isValid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    setAdmin(prev => ({
      ...prev,
      [name]: value,
    }));
    
    validateField(name as keyof AdminFormData, value);
  };

  const handleProfileImageChange = (photo: string) => {
    setAdmin(prev => ({
      ...prev,
      profileImage: photo,
    }));
  };

  const validateForm = (): boolean => {
    let isFormValid = true;
    const newValidation = { ...validation };
    const newErrors = { ...errors };
    
    // Only validate required fields
    const fieldsToValidate: (keyof ValidationState)[] = ['name', 'username'];
    
    fieldsToValidate.forEach(fieldName => {
      const value = admin[fieldName] || "";
      const isFieldValid = validateField(fieldName, String(value));
      newValidation[fieldName] = isFieldValid;
      
      if (!isFieldValid) {
        isFormValid = false;
      }
    });
    
    setValidation(newValidation);
    setErrors(newErrors);
    
    return isFormValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        setLoading(true);
        // Only send the fields that can be updated
        const updateData = {
          name: admin.name,
          username: admin.username,
          profileImage: admin.profileImage,
        };
        
        await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/admin/${id}`, updateData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        toast.success("Admin updated successfully");
        router.push("/admins");
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 422) {
          toast.error("Validation error");
          if (error.response?.data?.errors) {
            const serverErrors = error.response.data.errors;
            const newErrors: Partial<Record<keyof AdminFormData, string>> = {};
            const newValidation = {...validation};
            
            Object.keys(serverErrors).forEach((key) => {
              const fieldName = key as keyof AdminFormData;
              if (key in validation) {
                newErrors[fieldName] = serverErrors[key][0];
                newValidation[fieldName as keyof ValidationState] = false;
              }
            });
            
            setErrors(newErrors);
            setValidation(newValidation);
          }
        } else {
          console.error("Error updating admin:", error);
          toast.error("Failed to update admin");
        }
      } finally {
        setLoading(false);
      }
    } else {
      toast.error("Please fix the validation errors");
    }
  };

  if (fetchingAdmin) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-2">
          <svg className="animate-spin h-5 w-5 text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="text-gray-600 dark:text-gray-400">Loading admin data...</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageBreadcrumb pageTitle="Edit Admin" />
      <ComponentCard title="Admin Information" desc="Update admin information as needed.">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <div className="xl:col-span-2">
              <Label>Profile Picture (Optional)</Label>
              <ProfilePicUploader 
                profilePic={admin.profileImage} 
                onChange={handleProfileImageChange} 
              />
            </div>
            
            <div>
              <Label>Name *</Label>
              <Input 
                type="text" 
                name="name"
                value={admin.name}
                onChange={handleChange}
                error={!validation.name && admin.name !== ""}
                success={validation.name && admin.name !== ""}
                placeholder="John Doe" 
                hint={errors.name || ""}
              />
            </div>
            
            <div>
              <Label>Username *</Label>
              <Input 
                type="text" 
                name="username"
                value={admin.username}
                onChange={handleChange}
                error={!validation.username && admin.username !== ""}
                success={validation.username && admin.username !== ""}
                placeholder="johndoe123" 
                hint={errors.username || "Username must be at least 3 characters"}
              />
            </div>
            
            <div className="xl:col-span-2">
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 text-white bg-primary-500 dark:bg-primary-800 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Updating...
                  </span>
                ) : (
                  "Update Admin"
                )}
              </button>
              <button
                type="button"
                onClick={() => router.push("/admins")}
                className="px-4 py-2 ml-4 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      </ComponentCard>
    </div>
  );
};

export default EditAdmin;