// User & Authentication Types
export interface User {
  id: number;
  email?: string;
  nickname?: string;
  phoneNumber?: string;
  profileImageUrl?: string;
  isPhoneVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthProvider {
  id: number;
  userId: number;
  provider: 'google' | 'kakao' | 'naver';
  providerUserId: string;
  email?: string;
  rawProfileJson?: any;
  linkedAt: Date;
}

export interface PhoneVerification {
  id: number;
  phoneE164: string;
  code6: string;
  expiresAt: Date;
  verifiedAt?: Date;
  createdAt: Date;
}

export interface Address {
  id: number;
  userId: number;
  recipientName: string;
  phoneE164: string;
  postcode?: string;
  address1: string;
  address2?: string;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaymentMethod {
  id: number;
  userId: number;
  provider: 'tosspay' | 'card' | 'naverpay' | 'kakaopay' | 'virtual';
  externalKey: string;
  maskedInfo?: string;
  isDefault: boolean;
  createdAt: Date;
}

// Popup Store & Product Types
export interface PopupStore {
  id: number;
  name: string;
  description?: string;
  bannerImageUrl?: string;
  startsAt?: Date;
  endsAt?: Date;
  createdAt: Date;
}

export interface Tag {
  id: number;
  name: string;
}

export interface Product {
  id: number;
  popupStoreId: number;
  category: string;
  name: string;
  summary?: string;
  description?: string;
  material?: string;
  placeOfUse?: string;
  widthCm?: number;
  heightCm?: number;
  toleranceCm?: number;
  editionInfo?: string;
  conditionNote?: string;
  price: number;
  stock: number;
  shippingBaseFee: number;
  shippingFreeThreshold?: number;
  shippingExtraNote?: string;
  courierName?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  images?: ProductImage[];
  tags?: Tag[];
  popupStore: PopupStore;
  auction?: Auction;
}

export interface ProductImage {
  id: number;
  productId: number;
  imageUrl: string;
  sortOrder: number;
}

export interface ProductTag {
  productId: number;
  tagId: number;
}

// Auction Types
export interface Auction {
  id: number;
  productId: number;
  startPrice: number;
  minBidPrice: number;
  buyNowPrice?: number;
  depositAmount: number;
  startsAt: Date;
  endsAt: Date;
  status: 'scheduled' | 'running' | 'ended' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
  product?: Product;
  currentBid?: Bid;
  bidCount?: number;
}

export interface AuctionDeposit {
  id: number;
  auctionId: number;
  userId: number;
  paymentId?: number;
  amount: number;
  status: 'PENDING' | 'PAID' | 'REFUNDED' | 'FAILED';
  createdAt: Date;
}

export interface Bid {
  id: number;
  auctionId: number;
  userId: number;
  bidOrder: number;
  amount: number;
  createdAt: Date;
  user?: User;
}

export interface AuctionOffer {
  id: number;
  auctionId: number;
  bidId: number;
  userId: number;
  rankOrder: number;
  status: 'offered' | 'pending' | 'cancel';
  offeredAt: Date;
  expiresAt: Date;
  orderId?: number;
  createdAt: Date;
  updatedAt: Date;
}

// Order & Payment Types
export interface Order {
  id: number;
  userId: number;
  addressId?: number;
  status:
    | 'pending'
    | 'paid'
    | 'cancelled'
    | 'shipped'
    | 'delivered'
    | 'refunded';
  totalAmount: number;
  shippingFee: number;
  createdAt: Date;
  updatedAt: Date;
  items?: OrderItem[];
  address?: Address;
  payment?: Payment;
  shipment?: Shipment;
}

export interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  quantity: number;
  unitPrice: number;
  subtotalAmount: number;
  product?: Product;
}

export interface Payment {
  id: number;
  orderId?: number;
  userId: number;
  provider: 'tosspay' | 'kakaopay' | 'naverpay' | 'card' | 'virtual';
  externalTid?: string;
  amount: number;
  status: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED' | 'PARTIAL_REFUNDED';
  requestedAt: Date;
  paidAt?: Date;
  failReason?: string;
}

export interface PaymentRefund {
  id: number;
  paymentId: number;
  amount: number;
  reason?: string;
  refundedAt: Date;
}

export interface Shipment {
  id: number;
  orderId: number;
  courierName: string;
  trackingNumber: string;
  status: 'PREPARING' | 'IN_TRANSIT' | 'DELIVERED' | 'RETURNED';
  shippedAt?: Date;
  deliveredAt?: Date;
}

// Story Types
export interface Story {
  id: number;
  userId: number;
  productId: number;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  user?: User;
  product: Product;
  images: StoryImage[];
}

export interface StoryImage {
  id: number;
  storyId: number;
  imageUrl: string;
  sortOrder: number;
}

// Notification Types
export interface Notification {
  id: number;
  userId?: number;
  channel: 'EMAIL' | 'SMS' | 'PUSH';
  templateCode?: string;
  title?: string;
  body?: string;
  metadataJson?: any;
  sentAt: Date;
  status: 'QUEUED' | 'SENT' | 'FAILED';
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Form/Request Types
export interface SignUpRequest {
  email?: string;
  nickname?: string;
  phoneNumber?: string;
  provider?: 'google' | 'kakao' | 'naver';
  providerUserId?: string;
}

export interface LoginRequest {
  email?: string;
  password?: string;
  provider?: 'google' | 'kakao' | 'naver';
  providerToken?: string;
}

export interface BidRequest {
  auctionId: number;
  amount: number;
}

export interface CreateOrderRequest {
  items: {
    productId: number;
    quantity: number;
  }[];
  addressId: number;
  paymentMethodId?: number;
}

// Utility Types
export type OrderStatus = Order['status'];
export type PaymentStatus = Payment['status'];
export type AuctionStatus = Auction['status'];
export type PaymentProvider = Payment['provider'];
export type AuthProviderType = AuthProvider['provider'];
export type ShipmentStatus = Shipment['status'];
export type NotificationChannel = Notification['channel'];
