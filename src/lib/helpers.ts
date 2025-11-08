import { ContactInfo } from "@/types";

/**
 * Mask a phone number for display in lists
 * Example: +919876543210 -> 98******42
 */
export function maskPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.length < 4) return "****";

  const first = cleaned.slice(0, 2);
  const last = cleaned.slice(-2);
  return `${first}****${last}`;
}

/**
 * Mask an email for display in lists
 * Example: user@example.com -> u****@example.com
 */
export function maskEmail(email: string): string {
  const [localPart, domain] = email.split("@");
  if (!domain) return "****@****";

  const maskedLocal = localPart.charAt(0) + "****";
  return `${maskedLocal}@${domain}`;
}

/**
 * Get masked contact info for list display
 */
export function getMaskedContactInfo(
  phone: string,
  email: string
): ContactInfo {
  return {
    phone,
    email,
    maskedPhone: maskPhoneNumber(phone),
  };
}

/**
 * Calculate distance between two coordinates in kilometers
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Check if point is within radius
 */
export function isWithinRadius(
  centerLat: number,
  centerLon: number,
  pointLat: number,
  pointLon: number,
  radiusKm: number
): boolean {
  return (
    calculateDistance(centerLat, centerLon, pointLat, pointLon) <= radiusKm
  );
}

/**
 * Format phone number
 */
export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(
      6
    )}`;
  }
  if (cleaned.length === 11) {
    return `+${cleaned.charAt(0)} ${cleaned.slice(1, 4)} ${cleaned.slice(
      4,
      7
    )} ${cleaned.slice(7)}`;
  }
  return phone;
}

/**
 * Validate email
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate phone number
 */
export function isValidPhone(phone: string): boolean {
  const cleaned = phone.replace(/\D/g, "");
  return cleaned.length >= 10 && cleaned.length <= 15;
}

/**
 * Get time ago string
 */
export function getTimeAgo(date: string | Date): string {
  const now = new Date();
  const then = new Date(date);
  const seconds = Math.floor((now.getTime() - then.getTime()) / 1000);

  let interval = Math.floor(seconds / 31536000);
  if (interval >= 1)
    return interval === 1 ? "1 year ago" : `${interval} years ago`;

  interval = Math.floor(seconds / 2592000);
  if (interval >= 1)
    return interval === 1 ? "1 month ago" : `${interval} months ago`;

  interval = Math.floor(seconds / 86400);
  if (interval >= 1)
    return interval === 1 ? "1 day ago" : `${interval} days ago`;

  interval = Math.floor(seconds / 3600);
  if (interval >= 1)
    return interval === 1 ? "1 hour ago" : `${interval} hours ago`;

  interval = Math.floor(seconds / 60);
  if (interval >= 1)
    return interval === 1 ? "1 minute ago" : `${interval} minutes ago`;

  return "just now";
}

/**
 * Auto-hide items after X days
 */
export function shouldAutoArchiveItem(
  createdDate: string,
  daysToArchive: number = 30
): boolean {
  const created = new Date(createdDate);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - created.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > daysToArchive;
}

/**
 * Generate share URL
 */
export function generateShareURL(
  itemId: string,
  baseURL: string = window.location.origin
): string {
  return `${baseURL}/item/${itemId}`;
}

/**
 * Generate WhatsApp share link
 */
export function getWhatsAppShareLink(itemId: string, title: string): string {
  const url = generateShareURL(itemId);
  const text = encodeURIComponent(
    `Check out this item on ReUniteMe: ${title}\n${url}`
  );
  return `https://wa.me/?text=${text}`;
}

/**
 * Generate Telegram share link
 */
export function getTelegramShareLink(itemId: string, title: string): string {
  const url = generateShareURL(itemId);
  const text = encodeURIComponent(`Check out this item on ReUniteMe: ${title}`);
  return `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${text}`;
}

/**
 * Copy to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error("Failed to copy to clipboard:", err);
    return false;
  }
}
