"use client";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import React, { useState } from 'react';
import ComponentCard from '@/components/common/ComponentCard';
import Label from '@/components/form/Label';
import Input from '@/components/form/input/InputField';
import { EyeCloseIcon, EyeIcon } from '@/icons';
import ProfilePicUploader from "@/components/profilePicUploader";
import toast from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";
import useAuthStore from "@/store/authStore";

interface ValidationState {
  name: boolean;
  username: boolean;
  password: boolean;
  password_confirmation: boolean;
  profileImage: boolean;
}

const CreateAdmin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const {token} = useAuthStore();

  type AdminForm = {
    name: string;
    username: string;
    password: string;
    password_confirmation: string;
    profileImage: string;
  };

  const [admin, setAdmin] = useState<AdminForm>({
    name: "",
    username: "",
    password: "",
    password_confirmation: "",
    profileImage: "",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof AdminForm, string>>>({});
  const [validation, setValidation] = useState<ValidationState>({
    name: false,
    username: false,
    password: false,
    password_confirmation: false,
    profileImage: true,
  });

  const validateField = (name: keyof AdminForm, value: string): boolean => {
    let isValid = true;
    let errorMessage = "";

    if (name === "profileImage") {
      isValid = true;
      errorMessage = "";
    } else {
      switch (name) {
        case "username":
          isValid = /^[a-zA-Z0-9._-]{3,}$/.test(value);
          errorMessage = isValid ? "" : "Username must be at least 3 characters and contain only letters, numbers, dots, underscores, or hyphens";
          break;
        case "password":
          isValid = value.length >= 8;
          errorMessage = isValid ? "" : "Password must be at least 8 characters";
          break;
        case "password_confirmation":
          isValid = value === admin.password && value.length >= 8;
          errorMessage = isValid ? (value !== admin.password ? "Passwords do not match" : "Password must be at least 8 characters") : "";
          break;
        default:
          isValid = value.trim() !== "";
          errorMessage = isValid ? "" : `${name} is required`;
      }
    }

    setErrors(prev => ({ ...prev, [name]: errorMessage }));
    setValidation(prev => ({ ...prev, [name]: isValid }));
    return isValid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setAdmin({
      ...admin,
      [name]: value,
    });
    validateField(name as keyof AdminForm, value);
    
    // Re-validate password confirmation when password changes
    if (name === "password" && admin.password_confirmation) {
      validateField("password_confirmation", admin.password_confirmation);
    }
  };

  const handleProfileImageChange = (photo: string) => {
    setAdmin({
      ...admin,
      profileImage: photo,
    });
    setValidation(prev => ({ ...prev, profileImage: true }));
  };

  const validateForm = (): boolean => {
    let isFormValid = true;
    const newValidation = { ...validation };
    const newErrors = { ...errors };

    // Validate required fields
    const fieldsToValidate: (keyof AdminForm)[] = ['name', 'username', 'password', 'password_confirmation'];
    
    fieldsToValidate.forEach(fieldName => {
      const value = admin[fieldName];
      const isFieldValid = validateField(fieldName, value);
      newValidation[fieldName] = isFieldValid;
      
      if (!isFieldValid) {
        isFormValid = false;
        newErrors[fieldName] = newErrors[fieldName] || `${fieldName} is required`;
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
        
        // Only send the fields that the server expects
        const adminData = {
          name: admin.name,
          username: admin.username,
          password: admin.password,
          profileImage: admin.profileImage,
        };
        
        await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/admin/register`, adminData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        toast.success("Admin created successfully");
        router.push("/admins");
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 422) {
          toast.error("Validation error");
          if (error.response?.data?.errors) {
            const serverErrors = error.response.data.errors;
            const newErrors: Partial<Record<keyof AdminForm, string>> = {};
            const newValidation = {...validation};
            
            Object.keys(serverErrors).forEach((key) => {
              const fieldName = key as keyof AdminForm;
              if (fieldName in newErrors) {
                newErrors[fieldName] = serverErrors[key][0];
                newValidation[fieldName] = false;
              }
            });
            
            setErrors(newErrors);
            setValidation(newValidation);
          }
        } else {
          console.log("Error creating admin:", error);
          toast.error("Failed to create admin");
        }
      } finally {
        setLoading(false);
      }
    } else {
      toast.error("Form validation failed");
    }
  };

  return (
    <div>
      <PageBreadcrumb pageTitle="Add Admin" />
      <ComponentCard title="Admin Information" desc="Fill in all required fields to create a new admin.">
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
                placeholder="Jane Doe"
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
                placeholder="janedoe123"
                hint={errors.username || "Username must be at least 3 characters"}
              />
            </div>
            
            <div>
              <Label>Password *</Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={admin.password}
                  onChange={handleChange}
                  error={!validation.password && admin.password !== ""}
                  success={validation.password && admin.password !== ""}
                  placeholder="••••••••"
                  hint={errors.password || "Password must be at least 8 characters"}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                >
                  {showPassword ? <EyeCloseIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <Label>Confirm Password *</Label>
              <div className="relative">
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  name="password_confirmation"
                  value={admin.password_confirmation}
                  onChange={handleChange}
                  error={!validation.password_confirmation && admin.password_confirmation !== ""}
                  success={validation.password_confirmation && admin.password_confirmation !== ""}
                  placeholder="••••••••"
                  hint={errors.password_confirmation || "Confirm your password"}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                >
                  {showConfirmPassword ? <EyeCloseIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                </button>
              </div>
            </div>
            
            <div className="xl:col-span-2">
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 text-white bg-primary-500 dark:bg-primary-800 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              >
                {loading ? "Creating..." : "Create Admin"}
              </button>
              <button
                type="button"
                onClick={() => router.push("/admins")}
                className="px-4 py-2 ml-4 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
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

export default CreateAdmin;