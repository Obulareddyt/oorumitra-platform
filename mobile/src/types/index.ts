export type Language = 'EN' | 'TE' | 'TA' | 'KN' | 'HI';
export type Role = 'BUYER' | 'SELLER' | 'ADMIN';
export type ListingType = 'WORKER' | 'PRODUCT' | 'VEHICLE_WORK' | 'TRANSPORT' | 'REQUEST_TICKET';
export type BookingStatus =
  | 'INTERESTED' | 'CONTACTED' | 'PURCHASED'
  | 'PENDING' | 'ACCEPTED' | 'IN_PROGRESS' | 'COMPLETED'
  | 'CANCELLED';
export type MessageType = 'TEXT' | 'IMAGE' | 'LOCATION';

export type WorkType =
  | 'HARVESTING' | 'PLANTING' | 'CONSTRUCTION' | 'MASON_WORK' | 'PAINTING'
  | 'PLUMBING' | 'ELECTRICAL' | 'CARPENTER' | 'BOREWELL_WORK' | 'ROAD_WORK'
  | 'CLEANING' | 'LOADING_UNLOADING' | 'AGRICULTURE_WORK' | 'OTHERS';

export type PriceType = 'PERSON' | 'ACRE' | 'HOUR' | 'DAY' | 'KM';

export type ProductCategory =
  | 'AGRICULTURE' | 'HARDWARE' | 'LIVESTOCK' | 'VEHICLES' | 'SEEDS' | 'FRUITS' | 'FLOWERS';

export type ProductAvailabilityStatus = 'ACTIVE' | 'INACTIVE';

export type VehicleWorkType =
  | 'TRACTOR' | 'JCB' | 'CRANE' | 'BOREWELL_MACHINE' | 'EXCAVATOR' | 'HARVESTER';

export type TransportVehicleType =
  | 'AUTO' | 'TRACTOR' | 'MINI_TRUCK' | 'LORRY' | 'BUS';

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
  groupName: string;
  ownerName?: string;
  mobileNumber?: string;
  village: string;
  availableWorkers?: number;
  priceType: PriceType;
  amount: number;
  workType: WorkType;
  description?: string;
  latitude?: number;
  longitude?: number;
  imageUrls?: string[];
  averageRating?: number;
  ratingCount?: number;
  approvalStatus?: string;
  availableStatus: boolean;
  adminRemarks?: string;
  decidedAt?: string;
  decidedBy?: number;
  createdAt: string;
}

export interface Product {
  id: number;
  userId: number;
  productName: string;
  category: ProductCategory;
  subCategory?: string;
  ownerName?: string;
  mobileNumber?: string;
  amount: number;
  negotiable?: boolean;
  location: string;
  latitude?: number;
  longitude?: number;
  availability?: string;
  quantity?: number;
  description?: string;
  voiceNoteUrl?: string;
  imageUrls: string[];
  averageRating?: number;
  ratingCount?: number;
  approvalStatus?: string;
  availableStatus?: boolean;
  adminRemarks?: string;
  decidedAt?: string;
  decidedBy?: number;
  createdAt: string;
  updatedAt?: string;
  availabilityStatus: ProductAvailabilityStatus;
  statusUpdatedBy?: number;
  statusUpdatedDate?: string;
  statusUpdatedRole?: string;
}

export interface VehicleWorkListing {
  id: number;
  userId: number;
  vehicleType: VehicleWorkType;
  ownerName?: string;
  mobileNumber?: string;
  priceType?: PriceType;
  amount?: number;
  village: string;
  availableStatus: boolean;
  availableUntil?: string;
  description?: string;
  latitude?: number;
  longitude?: number;
  imageUrls?: string[];
  averageRating?: number;
  ratingCount?: number;
  approvalStatus?: string;
  adminRemarks?: string;
  decidedAt?: string;
  decidedBy?: number;
  createdAt: string;
}

export interface TransportListing {
  id: number;
  userId: number;
  vehicleType: TransportVehicleType;
  ownerName?: string;
  mobileNumber?: string;
  priceType?: PriceType;
  amount?: number;
  weightCapacity?: string;
  negotiable?: boolean;
  availability?: string;
  village: string;
  description?: string;
  latitude?: number;
  longitude?: number;
  imageUrls?: string[];
  averageRating?: number;
  ratingCount?: number;
  approvalStatus?: string;
  availableStatus: boolean;
  adminRemarks?: string;
  decidedAt?: string;
  decidedBy?: number;
  createdAt: string;
}

export interface RequestTicket {
  id: number;
  userId: number;
  title: string;
  description: string;
  location: string;
  requiredDate?: string;
  budget?: number;
  mobileNumber?: string;
  latitude?: number;
  longitude?: number;
  status: string;
  responseCount?: number;
  createdAt: string;
}

export interface Booking {
  id: number;
  listingType: ListingType;
  listingId: number;
  listingName?: string;
  customerId: number;
  customerName?: string;
  customerMobile?: string;
  ownerId?: number;
  ownerName?: string;
  ownerMobile?: string;
  status: BookingStatus;
  requiredDate?: string;
  serviceTime?: string;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
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
