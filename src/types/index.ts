export interface BasicInfo {
  name: string;
  email: string;
  phoneNumber: string;
  gender: string;
  city: string;
  profileImage: string;
}

export interface ProfessionalInfo {
  designation: string;
  department: string;
  specializations: string[];
  experience: number;
  bio: string;
}

export interface Education {
  degree: string;
  university: string;
  certificateUrl: string;
}

export interface AvailabilityConfig {
  instantChat: boolean;
  instantAudio: boolean;
  instantVideo: boolean;
  workingDays: string[];
  workingHours: {
    start: string;
    end: string;
  };
}

export interface PricingConfig {
  ratePerMinute: number;
  ratePerSession: number;
}

export interface AdvisorProfile {
  uid: string;
  basicInfo: BasicInfo;
  professionalInfo: ProfessionalInfo;
  education: Education;
  availability: AvailabilityConfig;
  pricing: PricingConfig;
  status: "ONLINE" | "OFFLINE" | "BUSY";
  createdAt: number; // Timestamp
  updatedAt: number; // Timestamp
  isVerified: boolean;
}

// Booking & Calls
export type BookingStatus = "pending" | "accepted" | "rejected" | "expired" | "completed";
export type PaymentStatus = "paid" | "unpaid";
export type CallType = "CHAT" | "AUDIO" | "VIDEO";

export interface BookingRequest {
  bookingId: string;
  studentId: string;
  advisorId: string;
  studentName: string;
  studentProfileImage: string;
  
  purpose: string;
  preferredLanguage: string;
  bookingType: CallType;
  urgencyLevel: "Instant" | "Scheduled";
  
  bookingStatus: BookingStatus;
  paymentStatus: PaymentStatus;
  
  bookingTimestamp: number; 
  advisorResponseDeadline: number;
  
  sessionAmount: number;
}

export interface VideoCallSession {
  id: string; 
  callerId: string; 
  receiverId: string; 
  status: "initiated" | "ongoing" | "ended";
  startTime: number;
  endTime?: number;
  lastHeartbeat: number;
  ratePerMinute: number;
  totalAmount?: number;
}

// Wallet
export interface WalletTransaction {
  id: string;
  amount: number;
  type: "CREDIT" | "DEBIT";
  description: string;
  timestamp: number;
  referenceId: string;
}
