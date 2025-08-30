"use client";
import { useState, useEffect } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import ProfilePicUploader from "@/components/profilePicUploader";
import useAuthStore from "@/store/authStore";
import toast from "react-hot-toast";
import axios from "axios";

interface AdminProfile {
  _id: string;
  name: string;
  username: string;
  profileImage: string;
}

interface PasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface ValidationState {
  name: boolean;
  username: boolean;
  profileImage: boolean;
}

interface PasswordValidation {
  currentPassword: boolean;
  newPassword: boolean;
  confirmPassword: boolean;
}

export default function Profile() {
  const { user, token, setUser } = useAuthStore();
  
  const [admin, setAdmin] = useState<AdminProfile>({
    _id: user?._id || "",
    name: user?.name || "",
    username: user?.username || "",
    profileImage: user?.profileImage || "",
  });

  const [password, setPassword] = useState<PasswordData>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [validation, setValidation] = useState<ValidationState>({
    name: !!user?.name,
    username: !!user?.username,
    profileImage: true,
  });

  const [passwordValidation, setPasswordValidation] = useState<PasswordValidation>({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof AdminProfile, string>>>({});
  const [passwordErrors, setPasswordErrors] = useState<Partial<Record<keyof PasswordData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPasswordSubmitting, setIsPasswordSubmitting] = useState(false);

  // Fetch current admin data
  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/admin/by-token`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const adminData = response.data;
        setAdmin(adminData);
        setValidation({
          name: !!adminData.name,
          username: !!adminData.username,
          profileImage: true,
        });
      } catch (error) {
        console.error("Error fetching admin data:", error);
      }
    };

    if (token) {
      fetchAdminData();
    }
  }, [token]);

  const validateField = (name: keyof AdminProfile, value: string): boolean => {
    let isValid = true;
    let errorMessage = "";

    switch (name) {
      case "name":
        isValid = value.trim() !== "";
        errorMessage = isValid ? "" : "Name is required";
        break;
      case "username":
        isValid = value.trim() !== "" && value.length >= 3;
        errorMessage = isValid ? "" : "Username must be at least 3 characters";
        break;
      case "profileImage":
        isValid = true;
        break;
      case "_id":
        isValid = true;
        break;
      default:
        isValid = value.trim() !== "";
        errorMessage = isValid ? "" : `${name} is required`;
    }

    setErrors(prev => ({ ...prev, [name]: errorMessage }));
    setValidation(prev => ({ ...prev, [name]: isValid }));
    return isValid;
  };

  const validatePasswordField = (name: keyof PasswordData, value: string): boolean => {
    let isValid = true;
    let errorMessage = "";

    switch (name) {
      case "currentPassword":
        isValid = value.trim() !== "";
        errorMessage = isValid ? "" : "Current password is required";
        break;
      case "newPassword":
        isValid = value.length >= 8;
        errorMessage = isValid ? "" : "New password must be at least 8 characters long";
        break;
      case "confirmPassword":
        isValid = value === password.newPassword && value !== "";
        errorMessage = isValid ? "" : "Passwords do not match";
        break;
    }

    setPasswordErrors(prev => ({ ...prev, [name]: errorMessage }));
    setPasswordValidation(prev => ({ ...prev, [name]: isValid }));
    return isValid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAdmin(prev => ({ ...prev, [name]: value }));
    validateField(name as keyof AdminProfile, value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPassword(prev => ({ ...prev, [name]: value }));
    validatePasswordField(name as keyof PasswordData, value);
  };

  const handleProfileImageChange = (imageUrl: string) => {
    setAdmin(prev => ({ ...prev, profileImage: imageUrl }));
    setValidation(prev => ({ ...prev, profileImage: true }));
  };

  const validateForm = (): boolean => {
    const nameValid = validateField("name", admin.name);
    const usernameValid = validateField("username", admin.username);
    return nameValid && usernameValid;
  };

  const validatePasswordForm = (): boolean => {
    const currentValid = validatePasswordField("currentPassword", password.currentPassword);
    const newValid = validatePasswordField("newPassword", password.newPassword);
    const confirmValid = validatePasswordField("confirmPassword", password.confirmPassword);
    return currentValid && newValid && confirmValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/by-token`,
        {
          name: admin.name,
          username: admin.username,
          profileImage: admin.profileImage,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      setUser(response.data.admin);
      toast.success("Profile updated successfully");
      setErrors({});
    } catch (error: any) {
      console.error("Error updating profile:", error);
      if (error.response?.status === 400) {
        toast.error("Username already exists");
      } else {
        toast.error("Failed to update profile");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validatePasswordForm()) {
      return;
    }

    try {
      setIsPasswordSubmitting(true);
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/${admin._id}/change-password`,
        {
          oldPassword: password.currentPassword,
          newPassword: password.newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      toast.success("Password updated successfully");
      setPassword({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setPasswordValidation({
        currentPassword: false,
        newPassword: false,
        confirmPassword: false,
      });
      setPasswordErrors({});
    } catch (error: any) {
      console.error("Error updating password:", error);
      if (error.response?.status === 400) {
        toast.error("Current password is incorrect");
      } else {
        toast.error("Failed to update password");
      }
    } finally {
      setIsPasswordSubmitting(false);
    }
  };

  return (
    <div>
      <PageBreadcrumb pageTitle="Profile Settings" />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <ComponentCard
          title="Personal Information"
          desc="Update your personal information."
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Profile Picture</Label>
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
                placeholder="Enter your name"
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
                placeholder="Enter your username"
                hint={errors.username || ""}
              />
            </div>
            
            <div className="flex justify-end pt-4">
              <Button 
                disabled={isSubmitting}
                className="px-6"
              >
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </ComponentCard>

        <ComponentCard
          title="Change Password"
          desc="Update your password for security."
          className="h-fit"
        >
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <Label>Current Password *</Label>
              <Input
                type="password"
                name="currentPassword"
                value={password.currentPassword}
                onChange={handlePasswordChange}
                error={!passwordValidation.currentPassword && password.currentPassword !== ""}
                success={passwordValidation.currentPassword}
                placeholder="Enter current password"
                hint={passwordErrors.currentPassword || ""}
              />
            </div>
            
            <div>
              <Label>New Password *</Label>
              <Input
                type="password"
                name="newPassword"
                value={password.newPassword}
                onChange={handlePasswordChange}
                error={!passwordValidation.newPassword && password.newPassword !== ""}
                success={passwordValidation.newPassword}
                placeholder="Enter new password"
                hint={passwordErrors.newPassword || "Minimum 8 characters"}
              />
            </div>
            
            <div>
              <Label>Confirm New Password *</Label>
              <Input
                type="password"
                name="confirmPassword"
                value={password.confirmPassword}
                onChange={handlePasswordChange}
                error={!passwordValidation.confirmPassword && password.confirmPassword !== ""}
                success={passwordValidation.confirmPassword}
                placeholder="Confirm new password"
                hint={passwordErrors.confirmPassword || ""}
              />
            </div>
            
            <div className="flex justify-end pt-4">
              <Button 
                disabled={isPasswordSubmitting}
                className="px-6"
              >
                {isPasswordSubmitting ? "Updating..." : "Update Password"}
              </Button>
            </div>
          </form>
        </ComponentCard>
      </div>
    </div>
  );
}