export interface DummyItem {
  id: string;
  user_id: string;
  type: "lost" | "found";
  item_name: string;
  description: string;
  category: string;
  location_address: string;
  location_city: string;
  location_country: string;
  latitude: number;
  longitude: number;
  item_date: string;
  image_url?: string;
  contact_name: string;
  contact_phone?: string;
  contact_email: string;
  status: "active" | "resolved" | "archived";
  created_at: string;
  updated_at: string;
}

export const dummyItems: DummyItem[] = [
  {
    id: "1",
    user_id: "user1",
    type: "lost",
    item_name: "iPhone 14 Pro",
    description:
      "Lost my iPhone 14 Pro in Space Gray. It has a clear case with a photo of my dog.",
    category: "Electronics",
    location_address: "Central Park",
    location_city: "New York",
    location_country: "USA",
    latitude: 40.7829,
    longitude: -73.9654,
    item_date: "2024-11-08",
    image_url:
      "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400",
    contact_name: "John Smith",
    contact_phone: "+1-555-0123",
    contact_email: "john.smith@email.com",
    status: "active",
    created_at: "2024-11-08T10:30:00Z",
    updated_at: "2024-11-08T10:30:00Z",
  },
  {
    id: "2",
    user_id: "user2",
    type: "found",
    item_name: "Brown Leather Wallet",
    description:
      "Found a brown leather wallet near Times Square. Contains ID and some cash.",
    category: "Accessories",
    location_address: "Times Square",
    location_city: "New York",
    location_country: "USA",
    latitude: 40.758,
    longitude: -73.9855,
    item_date: "2024-11-07",
    image_url:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400",
    contact_name: "Sarah Johnson",
    contact_email: "sarah.johnson@email.com",
    status: "active",
    created_at: "2024-11-07T14:15:00Z",
    updated_at: "2024-11-07T14:15:00Z",
  },
  {
    id: "3",
    user_id: "user3",
    type: "lost",
    item_name: "Golden Retriever - Max",
    description:
      "Lost my golden retriever Max near the Brooklyn Bridge. He's very friendly and responds to his name.",
    category: "Pets",
    location_address: "Brooklyn Bridge Park",
    location_city: "Brooklyn",
    location_country: "USA",
    latitude: 40.7024,
    longitude: -73.9969,
    item_date: "2024-11-06",
    image_url:
      "https://images.unsplash.com/photo-1552053831-71594a27632d?w=400",
    contact_name: "Mike Chen",
    contact_phone: "+1-555-0456",
    contact_email: "mike.chen@email.com",
    status: "active",
    created_at: "2024-11-06T09:45:00Z",
    updated_at: "2024-11-06T09:45:00Z",
  },
  {
    id: "4",
    user_id: "user4",
    type: "found",
    item_name: "Silver MacBook Pro",
    description:
      "Found a silver MacBook Pro 16-inch in a coffee shop in Soho. Has stickers on the back.",
    category: "Electronics",
    location_address: "Soho Coffee Shop",
    location_city: "New York",
    location_country: "USA",
    latitude: 40.7233,
    longitude: -74.003,
    item_date: "2024-11-05",
    image_url:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400",
    contact_name: "Emma Wilson",
    contact_email: "emma.wilson@email.com",
    status: "active",
    created_at: "2024-11-05T16:20:00Z",
    updated_at: "2024-11-05T16:20:00Z",
  },
  {
    id: "5",
    user_id: "user5",
    type: "lost",
    item_name: "Blue Backpack",
    description:
      "Lost my blue hiking backpack with laptop and important documents inside.",
    category: "Bags",
    location_address: "Penn Station",
    location_city: "New York",
    location_country: "USA",
    latitude: 40.7505,
    longitude: -73.9934,
    item_date: "2024-11-04",
    image_url:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400",
    contact_name: "David Rodriguez",
    contact_phone: "+1-555-0789",
    contact_email: "david.rodriguez@email.com",
    status: "active",
    created_at: "2024-11-04T11:10:00Z",
    updated_at: "2024-11-04T11:10:00Z",
  },
  {
    id: "6",
    user_id: "user6",
    type: "found",
    item_name: "Diamond Ring",
    description:
      "Found a beautiful diamond engagement ring in Washington Square Park.",
    category: "Jewelry",
    location_address: "Washington Square Park",
    location_city: "New York",
    location_country: "USA",
    latitude: 40.7308,
    longitude: -73.9973,
    item_date: "2024-11-03",
    image_url:
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400",
    contact_name: "Lisa Thompson",
    contact_email: "lisa.thompson@email.com",
    status: "active",
    created_at: "2024-11-03T13:30:00Z",
    updated_at: "2024-11-03T13:30:00Z",
  },
];
