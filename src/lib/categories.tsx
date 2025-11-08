import { ItemCategory, CategoryInfo } from "@/types";
import {
  Smartphone,
  FileText,
  PawPrint,
  Luggage,
  Watch,
  Shirt,
  Gem,
  Trophy,
  Key,
  Wallet,
  Phone,
  HelpCircle,
} from "lucide-react";

export const ITEM_CATEGORIES: Record<ItemCategory, CategoryInfo> = {
  electronics: {
    name: "electronics",
    label: "Electronics",
    icon: "Smartphone",
    color: "bg-blue-100 text-blue-800",
    description: "Phones, laptops, tablets, etc.",
  },
  documents: {
    name: "documents",
    label: "Documents",
    icon: "FileText",
    color: "bg-amber-100 text-amber-800",
    description: "ID cards, passports, certificates, etc.",
  },
  pets: {
    name: "pets",
    label: "Pets",
    icon: "PawPrint",
    color: "bg-orange-100 text-orange-800",
    description: "Dogs, cats, birds, etc.",
  },
  luggage: {
    name: "luggage",
    label: "Luggage",
    icon: "Luggage",
    color: "bg-green-100 text-green-800",
    description: "Bags, suitcases, backpacks, etc.",
  },
  accessories: {
    name: "accessories",
    label: "Accessories",
    icon: "Watch",
    color: "bg-pink-100 text-pink-800",
    description: "Belts, scarves, hats, etc.",
  },
  clothing: {
    name: "clothing",
    label: "Clothing",
    icon: "Shirt",
    color: "bg-purple-100 text-purple-800",
    description: "Shirts, pants, jackets, etc.",
  },
  jewelry: {
    name: "jewelry",
    label: "Jewelry",
    icon: "Gem",
    color: "bg-rose-100 text-rose-800",
    description: "Rings, necklaces, bracelets, etc.",
  },
  sports: {
    name: "sports",
    label: "Sports & Recreation",
    icon: "Trophy",
    color: "bg-lime-100 text-lime-800",
    description: "Sports equipment, gear, etc.",
  },
  keys: {
    name: "keys",
    label: "Keys",
    icon: "Key",
    color: "bg-yellow-100 text-yellow-800",
    description: "House keys, car keys, etc.",
  },
  wallet: {
    name: "wallet",
    label: "Wallet",
    icon: "Wallet",
    color: "bg-red-100 text-red-800",
    description: "Wallets, purses, money, etc.",
  },
  phone: {
    name: "phone",
    label: "Mobile Phone",
    icon: "Phone",
    color: "bg-cyan-100 text-cyan-800",
    description: "Smartphones, feature phones, etc.",
  },
  other: {
    name: "other",
    label: "Other Items",
    icon: "HelpCircle",
    color: "bg-gray-100 text-gray-800",
    description: "Other items not listed above",
  },
};

export const CATEGORY_ICONS: Record<ItemCategory, React.ReactNode> = {
  electronics: <Smartphone className="w-5 h-5" />,
  documents: <FileText className="w-5 h-5" />,
  pets: <PawPrint className="w-5 h-5" />,
  luggage: <Luggage className="w-5 h-5" />,
  accessories: <Watch className="w-5 h-5" />,
  clothing: <Shirt className="w-5 h-5" />,
  jewelry: <Gem className="w-5 h-5" />,
  sports: <Trophy className="w-5 h-5" />,
  keys: <Key className="w-5 h-5" />,
  wallet: <Wallet className="w-5 h-5" />,
  phone: <Phone className="w-5 h-5" />,
  other: <HelpCircle className="w-5 h-5" />,
};

export function getCategoryLabel(category: ItemCategory): string {
  return ITEM_CATEGORIES[category]?.label || "Other";
}

export function getCategoryColor(category: ItemCategory): string {
  return ITEM_CATEGORIES[category]?.color || "bg-gray-100 text-gray-800";
}

export function getCategoryIcon(category: ItemCategory) {
  return CATEGORY_ICONS[category];
}

export function getDefaultCategory(): ItemCategory {
  return "other";
}

export const ALL_CATEGORIES = Object.keys(ITEM_CATEGORIES) as ItemCategory[];
