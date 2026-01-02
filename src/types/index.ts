export interface BasicInfo {
  id: string; // auth uid
  name: string;
  email: string;
  phoneNumber: string;
  gender: string;
  city: string;
  profileImage: string;
  status: string;
}

export interface ProfessionalInfo {
  designation: string;
  department: string;
  experience: number;
  yearsInOrganization: number;
  employeeId: string;
  bio: string;
  officeLocation: string;
  specializations: string[];
  certifications: string[];
  languages: string[];
  specializationUrls: Record<string, string>;
}

export interface Education {
  // Keeping this for backward compatibility or if needed, though not explicitly deep in new spec
  // accessible via basicInfo or separate. New spec puts education in "educationInfo".
  highestQualification: string;
  qualificationField: string;
  university: string;
  highestQualificationUrl: string;
}

export interface AvailabilityConfig {
  workingDays: string[];
  workingHoursStart: string;
  workingHoursEnd: string;
  appointmentDuration: number;
  scheduledAvailability: {
    isChatEnabled: boolean;
    isAudioCallEnabled: boolean;
    isVideoCallEnabled: boolean;
    isInPersonEnabled: boolean;
    isOfficeVisitEnabled: boolean;
  };
  instantAvailability: {
    isChatEnabled: boolean;
    isAudioCallEnabled: boolean;
    isVideoCallEnabled: boolean;
  };
}

export interface PricingConfig {
  instantChatFee: number;
  instantAudioFee: number;
  instantVideoFee: number;
  scheduledChatFee: number;
  scheduledAudioFee: number;
  scheduledVideoFee: number;
  scheduledInPersonFee: number;
}

export interface EarningsInfo {
  totalLifetimeEarnings: number;
  todayEarnings: number;
  thisWeekEarnings: number;
  thisMonthEarnings: number;
  pendingBalance: number;
  pendingWithdrawals: number;
  totalWithdrawn: number;
}

export interface BankAccount {
  accountHolderName: string;
  accountNumber: string;
  ifscCode: string;
  bankName: string;
  branchName: string;
  accountType: string;
  isVerified: boolean;
  panNumber: string;
  upiId: string;
  linkedMobile: string;
}

export interface AdvisorProfile {
  uid: string; // Redundant but useful for app logic
  basicInfo: BasicInfo;
  professionalInfo: ProfessionalInfo;
  educationInfo: Education; // Renamed from education to educationInfo to match spec
  availabilityInfo: AvailabilityConfig; // Renamed from availability to availabilityInfo
  pricingInfo: PricingConfig; // Renamed from pricing to pricingInfo
  earningsInfo: EarningsInfo;
  bankAccounts: BankAccount[];
  fcmToken: string;

  // Flattened stats for dashboard (convenience) - keeping these or deriving them?
  // Spec doesn't explicitly mention 'rating' in the main object, but we'll leave them optional or derive them.
  // I will keep them for UI convenience as they were helpful.
  totalSessions: number;
  rating: number;
  reviewCount: number;

  createdAt: number;
  updatedAt: number;
  isVerified: boolean;
}

// Booking & Calls
export type BookingStatus = "pending" | "accepted" | "rejected" | "expired" | "completed" | "cancelled";
export type PaymentStatus = "paid" | "unpaid";
export type CallType = "CHAT" | "AUDIO" | "VIDEO";

export interface BookingRequest {
  bookingId: string;
  studentId: string;
  advisorId: string;

  studentName: string;
  studentProfileImage: string;

  purpose: string;
  additionalNotes?: string;
  preferredLanguage: string;
  bookingType: CallType;
  bookingCategory: "Instant" | "Scheduled";

  bookingStatus: BookingStatus;

  // Scheduled Specific
  bookingDate?: string;
  bookingSlot?: string;
  sessionAmount: number;

  bookingTimestamp: number;
}

// Wallet
export interface WithdrawalRequest {
  requestId: string;
  advisorId: string;
  advisorName: string;
  advisorEmail: string;
  requestedAmount: number;
  platformFee: number;
  gstOnFee: number;
  tdsDeducted: number;
  totalDeductions: number;
  netPayableAmount: number;

  bankAccountNumber: string;
  bankName: string;
  bankIfscCode: string;
  bankAccountHolderName: string;

  status: "PENDING" | "APPROVED" | "PROCESSING" | "COMPLETED" | "FAILED" | "REJECTED";
  requestedAt: number;
  completedAt?: number;
}
