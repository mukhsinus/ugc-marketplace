/**
 * Frontend API Response Types
 * These types match the backend responses defined in backend/src/types/responses.ts
 * Updated: March 30, 2026
 */

// =============================================
// ENUMS (matching backend)
// =============================================

export enum UserRole {
  ADMIN = "admin",
  CREATOR = "creator",
  BRAND = "brand"
}

export enum JobStatus {
  OPEN = "open",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
  CANCELLED = "cancelled"
}

export enum ProposalStatus {
  PENDING = "pending",
  ACCEPTED = "accepted",
  REJECTED = "rejected"
}

export enum ContractStatus {
  ACTIVE = "active",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
  DISPUTED = "disputed"
}

export enum PayoutStatus {
  PENDING = "pending",
  APPROVED = "approved",
  PAID = "paid",
  REJECTED = "rejected"
}

export enum SubmissionStatus {
  SUBMITTED = "submitted",
  APPROVED = "approved",
  REVISION_REQUESTED = "revision_requested"
}

export enum ContentCategory {
  BEAUTY = "beauty",
  FASHION = "fashion",
  FOOD = "food",
  TECH = "tech",
  LIFESTYLE = "lifestyle",
  FITNESS = "fitness",
  EDUCATION = "education",
  TRAVEL = "travel"
}

// =============================================
// BASE RESPONSE WRAPPERS
// =============================================

export interface ApiResponse<T> {
  data: T;
  error?: string | null;
}

export interface ApiErrorResponse {
  error: string;
  statusCode?: number;
}

// =============================================
// USER / PROFILE RESPONSES
// =============================================

export interface UserResponse {
  id: string;
  email: string;
  name?: string | null;
  username?: string | null;
  role: UserRole;
  avatar_url?: string | null;
  city?: string | null;
  bio?: string | null;
  created_at: string;
}

export interface ProfileResponse {
  id: string;
  user_id: string;
  email: string;
  role: UserRole;
  name?: string | null;
  username?: string | null;
  city?: string | null;
  bio?: string | null;
  categories?: ContentCategory[] | null;
  price_from?: number | null;
  instagram_link?: string | null;
  tiktok_link?: string | null;
  youtube_link?: string | null;
  avatar_url?: string | null;
  rating?: number | null;
  review_count?: number | null;
  company_name?: string | null;
  contact_name?: string | null;
  website?: string | null;
  industry?: string | null;
  is_banned?: boolean | null;
  created_at: string;
  updated_at: string;
}

export interface CurrentUserResponse {
  user: UserResponse;
  profile: ProfileResponse;
}

// =============================================
// JOB RESPONSES
// =============================================

export interface JobResponse {
  id: string;
  title: string;
  description?: string;
  brand_id: string;
  budget_min?: number | null;
  budget_max?: number | null;
  content_type?: string | null;
  platform?: string | null;
  videos_required?: number | null;
  deadline?: string | null;
  status: JobStatus;
  created_at: string;
  updated_at: string;
}

export interface JobDetailResponse extends JobResponse {
  brand?: ProfileResponse;
  proposals_count?: number;
  selected_proposal?: ProposalDetailResponse | null;
}

// =============================================
// PROPOSAL RESPONSES
// =============================================

export interface ProposalResponse {
  id: string;
  job_id: string;
  creator_id: string;
  message?: string | null;
  price_offer?: number | null;
  delivery_time?: number | null;
  status: ProposalStatus;
  created_at: string;
  updated_at: string;
}

export interface ProposalDetailResponse extends ProposalResponse {
  creator?: ProfileResponse;
  job?: JobResponse;
}

// =============================================
// CONTRACT RESPONSES
// =============================================

export interface ContractResponse {
  id: string;
  job_id: string;
  brand_id: string;
  creator_id: string;
  amount: number;
  currency: string;
  status: ContractStatus;
  created_at: string;
  updated_at: string;
}

export interface ContractDetailResponse extends ContractResponse {
  job?: JobResponse;
  brand?: ProfileResponse;
  creator?: ProfileResponse;
  submissions?: SubmissionResponse[];
}

// =============================================
// SUBMISSION RESPONSES
// =============================================

export interface SubmissionResponse {
  id: string;
  contract_id: string;
  creator_id: string;
  content_url: string;
  status: SubmissionStatus;
  feedback?: string | null;
  created_at: string;
  updated_at: string;
}

// =============================================
// MESSAGE RESPONSES
// =============================================

export interface MessageResponse {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  is_read: boolean;
  created_at: string;
}

export interface ConversationResponse {
  id: string;
  job_id: string;
  participant_1_id: string;
  participant_2_id: string;
  last_message?: string;
  last_message_at?: string;
  unread_count: number;
  created_at: string;
}

// =============================================
// PAYOUT RESPONSES
// =============================================

export interface PayoutResponse {
  id: string;
  wallet_id: string;
  user_id: string;
  amount: number;
  currency: string;
  method: string;
  status: PayoutStatus;
  external_reference?: string | null;
  created_at: string;
  processed_at?: string | null;
}

// =============================================
// WALLET & TRANSACTION RESPONSES
// =============================================

export interface WalletResponse {
  id: string;
  user_id: string;
  balance: number;
  currency: string;
  created_at: string;
  updated_at: string;
}

// =============================================
// PORTFOLIO RESPONSES
// =============================================

export interface PortfolioItemResponse {
  id: string;
  creator_id: string;
  title: string;
  description?: string;
  content_url: string;
  thumbnail_url?: string;
  category: ContentCategory;
  created_at: string;
}

// =============================================
// DASHBOARD RESPONSES
// =============================================

export interface CreatorDashboardResponse {
  profile: ProfileResponse;
  stats: {
    active_proposals: number;
    active_contracts: number;
    completed_contracts: number;
    pending_payouts: number;
    total_earnings: number;
  };
  recent_proposals: ProposalDetailResponse[];
  recent_messages: ConversationResponse[];
  pending_payouts: PayoutResponse[];
}

export interface BrandDashboardResponse {
  profile: ProfileResponse;
  stats: {
    active_jobs: number;
    total_proposals: number;
    active_contracts: number;
    completed_contracts: number;
    total_spent: number;
  };
  active_jobs: JobDetailResponse[];
  recent_proposals: ProposalDetailResponse[];
  recent_messages: ConversationResponse[];
}

// =============================================
// AUTH RESPONSES
// =============================================

export interface LoginResponse {
  user: UserResponse;
  profile: ProfileResponse;
  session: {
    access_token: string;
    refresh_token?: string;
    expires_in: number;
  };
}

export type SignupResponse = LoginResponse;
