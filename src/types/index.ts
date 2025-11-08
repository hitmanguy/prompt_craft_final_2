// Item Status Workflow
export type ItemStatus = "active" | "resolved" | "archived";

// Item Type
export type ItemType = "lost" | "found";

// Categories for Items
export type ItemCategory =
  | "electronics"
  | "documents"
  | "pets"
  | "luggage"
  | "accessories"
  | "clothing"
  | "jewelry"
  | "sports"
  | "keys"
  | "wallet"
  | "phone"
  | "other";

export interface CategoryInfo {
  name: ItemCategory;
  label: string;
  icon: string;
  color: string;
  description: string;
}

export interface Location {
  latitude: number;
  longitude: number;
  address: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
}

export interface ItemTag {
  id: string;
  name: string;
  confidence?: number; // AI confidence score (0-1)
  isAI?: boolean; // Whether tag was auto-generated
}

export interface ItemPhoto {
  id: string;
  url: string;
  compressedUrl?: string;
  size: number;
  uploadedAt: string;
  order: number;
}

export interface ReUniteItem {
  id: string;
  title: string;
  description: string;
  itemType: ItemType; // 'lost' or 'found'
  category: ItemCategory;
  tags: ItemTag[];
  photos: ItemPhoto[];
  location: Location;
  status: ItemStatus;
  userId: string;
  userPhone: string; // Masked in lists
  userEmail: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  archivedAt?: string;
  reportCount: number;
  viewCount: number;
}

export interface Match {
  id: string;
  lostItemId: string;
  foundItemId: string;
  similarity: number; // 0-1 score
  reason: string; // "text_match", "location_proximity", "category_match", etc.
  matchedAt: string;
  createdAt: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  receiverId: string;
  content: string;
  isRead: boolean;
  createdAt: string;
}

export interface Conversation {
  id: string;
  item1Id: string;
  item2Id: string;
  participant1Id: string;
  participant2Id: string;
  lastMessage?: string;
  lastMessageTime?: string;
  createdAt: string;
}

export interface SavedFilter {
  id: string;
  userId: string;
  name: string;
  category?: ItemCategory;
  itemType?: ItemType;
  location?: Location;
  radiusKm?: number;
  tags?: string[];
  createdAt: string;
}

export interface Report {
  id: string;
  itemId: string;
  reportedBy: string;
  reason: string;
  description: string;
  status: "pending" | "reviewed" | "resolved" | "dismissed";
  createdAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: "match" | "message" | "status_update" | "digest";
  title: string;
  message: string;
  relatedItemId?: string;
  relatedConversationId?: string;
  isRead: boolean;
  createdAt: string;
  readAt?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  phone: string;
  displayName: string;
  avatar?: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  notificationPreferences: {
    emailMatches: boolean;
    emailMessages: boolean;
    emailDigest: boolean;
    pushNotifications: boolean;
    digestFrequency: "daily" | "weekly" | "never";
  };
  followedCategories: ItemCategory[];
  followedLocations: Location[];
  createdAt: string;
  updatedAt: string;
}

export interface ContactInfo {
  phone: string;
  email: string;
  maskedPhone: string;
}

export interface GeoSearchParams {
  latitude: number;
  longitude: number;
  radiusKm: number;
  category?: ItemCategory;
  itemType?: ItemType;
}
