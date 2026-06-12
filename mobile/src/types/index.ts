export type Language = 'EN' | 'TE' | 'TA' | 'KN' | 'HI';
export type Role = 'BUYER' | 'SELLER' | 'ADMIN';
export type ListingType = 'WORKER' | 'PRODUCT' | 'VEHICLE_WORK' | 'TRANSPORT' | 'REQUEST_TICKET';
export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
export type MessageType = 'TEXT' | 'IMAGE' | 'LOCATION';

export type WorkType =
  | 'HARVESTING' | 'PLANTING' | 'WEEDING' | 'IRRIGATION' | 'SPRAYING'
  | 'MASON_WORK' | 'CARPENTRY' | 'ELECTRICAL' | 'PLUMBING' | 'PAINTING'
  | 'BOREWELL_WORK' | 'CLEANING' | 'DRIVING' | 'OTHER';

export type PriceType = 'FIXED' | 'NEGOTIABLE' | 'PER_DAY' | 'PER_ACRE' | 'PER_KM' | 'PER_HOUR';

export type ProductCategory =
  | 'SEEDS' | 'FERTILIZERS' | 'PESTICIDES' | 'TOOLS' | 'EQUIPMENT'
  | 'LIVESTOCK' | 'DAIRY' | 'VEGETABLES' | 'FRUITS' | 'GRAINS' | 'OTHER';

export type VehicleWorkType =
  | 'PLOUGHING' | 'THRESHING' | 'ROTAVATOR' | 'SPRAYING' | 'HARVESTING' | 'LEVELLING' | 'OTHER';

export type TransportVehicleType =
  | 'MINI_TRUCK' | 'LARGE_TRUCK' | 'TRACTOR_TRAILER' | 'PICKUP' | 'AUTO_RICKSHAW' | 'OTHER';

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  mobileNumber: string;
  email?: string;
  gender?: string;
  role: Role;
  profilePhotoUrl?: string;
  language: Language;
  village?: string;
  isVerified?: boolean;
  fcmToken?: string;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface WorkerListing {
  id: number;
  userId: number;
  title: string;
  description?: string;
  workType: WorkType;
  village: string;
  pricePerDay: number;
  isAvailable: boolean;
  experienceYears?: number;
  latitude?: number;
  longitude?: number;
  averageRating?: number;
  ratingCount?: number;
  distance?: number;
  createdAt: string;
}

export interface Product {
  id: number;
  userId: number;
  title: string;
  description?: string;
  category: ProductCategory;
  price: number;
  priceType?: PriceType;
  village: string;
  imageUrls: string[];
  latitude?: number;
  longitude?: number;
  averageRating?: number;
  ratingCount?: number;
  distance?: number;
  createdAt: string;
}

export interface VehicleWorkListing {
  id: number;
  userId: number;
  title: string;
  description?: string;
  vehicleWorkType: VehicleWorkType;
  village: string;
  pricePerAcre: number;
  isAvailable: boolean;
  latitude?: number;
  longitude?: number;
  averageRating?: number;
  ratingCount?: number;
  distance?: number;
  createdAt: string;
}

export interface TransportListing {
  id: number;
  userId: number;
  title: string;
  description?: string;
  vehicleType: TransportVehicleType;
  village: string;
  ratePerKm: number;
  capacityTons?: number;
  isAvailable?: boolean;
  latitude?: number;
  longitude?: number;
  averageRating?: number;
  ratingCount?: number;
  distance?: number;
  createdAt: string;
}

export interface RequestTicket {
  id: number;
  userId: number;
  title: string;
  description: string;
  workType: WorkType;
  village: string;
  budget?: number;
  status: 'OPEN' | 'IN_PROGRESS' | 'CLOSED';
  createdAt: string;
}

export interface Booking {
  id: number;
  listingType: ListingType;
  listingId: number;
  status: BookingStatus;
  amount?: number;
  requiredDate?: string;
  notes?: string;
  createdAt: string;
}

export interface ChatConversation {
  id: number;
  buyerId: number;
  sellerId: number;
  buyerName: string;
  sellerName: string;
  listingType?: ListingType;
  listingId?: number;
  lastMessage?: string;
  lastMessageAt?: string;
  unreadCount: number;
}

export interface ChatMessage {
  id: number;
  conversationId: number;
  senderId: number;
  senderName: string;
  content: string;
  messageType: MessageType;
  mediaUrl?: string;
  isRead: boolean;
  createdAt: string;
}

export interface Rating {
  id: number;
  reviewerId: number;
  reviewerName: string;
  listingType: ListingType;
  listingId: number;
  stars: number;
  comment?: string;
  createdAt: string;
}

export interface Notification {
  id: number;
  title: string;
  body?: string;
  type: string;
  data?: Record<string, string>;
  isRead: boolean;
  createdAt: string;
}

export interface PagedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}
