import React from "react";

// User/Admin Types
export interface Admin {
  _id: string;
  profileImage: string;
  name: string;
  username: string;
  password?: string;
  createdAt: string;
  updatedAt: string;
}

// Contact/Enquiry Types
export interface Contact {
  _id: string;
  name: string;
  email: string;
  roll: string;
  message: string;
  createdAt: string;
}

// Recruitment Types
export interface Recruitment {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  rollNumber: string;
  degreeProgram: string;
  linkedin?: string;
  whyJoin: string;
  selectedTeam: string;
  selectedRole: "member" | "lead";
  whyThisTeam: string;
  relevantSkills: string;
  timeCommitment: string;
  improvementIdea: string;
  whyLeadTeam?: string;
  leadershipExperience?: string;
  teamOrganization?: string;
  handleUnderperformers?: string;
  teamVision?: string;
  timeCommitmentAgreement: boolean;
  attendanceCommitment: boolean;
  professionalismCommitment: boolean;
  status: "submitted" | "accepted" | "rejected";
  submittedAt: string;
  createdAt: string;
  updatedAt: string;
}

// Event Types
export interface Event {
  _id: string;
  title: string;
  description: string;
  images: string[];
  createdAt: string;
  updatedAt: string;
}

// Dashboard Stats Types
export interface DashboardStats {
  contactCount: number;
  eventCount: number;
  recruitmentCount: number;
  brainGamesCount: number;
  recruitmentStats: {
    _id: string;
    count: number;
  }[];
  brainGamesStats: {
    _id: string;
    count: number;
  }[];
  teamStats: {
    _id: string;
    count: number;
  }[];
  roleStats: {
    _id: string;
    count: number;
  }[];
  recentActivity: {
    contacts: number;
    recruitments: number;
    events: number;
    brainGames: number;
  };
  latestApplications: Recruitment[];
  latestContacts: Contact[];
}

// Common Types
export interface PaginatedResponse<T> {
  data: T[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
}

// Form Types
export interface EventFormData {
  title: string;
  description: string;
  images: string[];
}

export interface AdminFormData {
  profileImage: string;
  name: string;
  username: string;
  password?: string;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

export interface ApiError {
  message: string;
  status: number;
}

// Modal Props
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  showCloseButton?: boolean;
  isFullscreen?: boolean;
}

// Table Props
export interface TableProps {
  children: React.ReactNode;
  className?: string;
}

export interface TableCellProps {
  children: React.ReactNode;
  className?: string;
  isHeader?: boolean;
  colSpan?: number;
}

// Component Props
export interface ComponentCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  desc?: string;
}

export interface BadgeProps {
  children: React.ReactNode;
  variant?: "success" | "error" | "warning" | "info";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export interface ButtonProps {
  children: React.ReactNode;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  className?: string;
  onClick?: () => void;
}

// Navigation Types
export interface NavItem {
  icon: React.ReactNode;
  name: string;
  path: string;
}

// Form Input Types
export interface SelectOption {
  value: string;
  label: string;
}

export interface MultiSelectOption {
  value: string;
  text: string;
  selected: boolean;
}

// Photo Uploader Types
export interface PhotosUploaderProps {
  addedPhotos: string[];
  maxPhotos: number;
  onChange: (photos: string[]) => void;
}

// Authentication Types
export interface AuthState {
  token: string | null;
  admin: Admin | null;
  isAuthenticated: boolean;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  admin: Admin;
  token: string;
}

// Filter Types
export interface RecruitmentFilters {
  status?: "submitted" | "accepted" | "rejected" | "all";
  team?: string;
  role?: "member" | "lead" | "all";
  search?: string;
}

export interface EventFilters {
  search?: string;
  dateFrom?: string;
  dateTo?: string;
}