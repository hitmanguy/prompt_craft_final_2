import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Eye, EyeOff, Copy, Check } from "lucide-react";
import {
  maskPhoneNumber,
  formatPhoneNumber,
  copyToClipboard,
} from "@/lib/helpers";

interface ContactInfoProps {
  phone: string;
  email: string;
  isLoggedIn: boolean;
  showFull?: boolean;
  size?: "sm" | "md" | "lg";
}

export const ContactInfo: React.FC<ContactInfoProps> = ({
  phone,
  email,
  isLoggedIn,
  showFull = false,
  size = "md",
}) => {
  const [revealed, setRevealed] = useState(showFull);
  const [copied, setCopied] = useState<"phone" | "email" | null>(null);

  const handleCopy = async (text: string, type: "phone" | "email") => {
    if (await copyToClipboard(text)) {
      setCopied(type);
      setTimeout(() => setCopied(null), 2000);
    }
  };

  const sizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };

  const shouldMask = !revealed && !showFull;

  return (
    <Card className={`p-4 space-y-3 ${sizeClasses[size]}`}>
      {/* Phone */}
      <div className="space-y-1">
        <p className="font-medium text-gray-700">Phone</p>
        <div className="flex items-center justify-between bg-gray-50 rounded p-2">
          <span className="font-mono">
            {shouldMask ? maskPhoneNumber(phone) : formatPhoneNumber(phone)}
          </span>
          <button
            onClick={() => handleCopy(phone, "phone")}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            title="Copy phone"
          >
            {copied === "phone" ? (
              <Check className="w-4 h-4 text-green-500" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Email */}
      <div className="space-y-1">
        <p className="font-medium text-gray-700">Email</p>
        <div className="flex items-center justify-between bg-gray-50 rounded p-2">
          <span className="font-mono truncate">
            {shouldMask
              ? email.split("@")[0][0] + "****@" + email.split("@")[1]
              : email}
          </span>
          <button
            onClick={() => handleCopy(email, "email")}
            className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0 ml-2"
            title="Copy email"
          >
            {copied === "email" ? (
              <Check className="w-4 h-4 text-green-500" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Reveal button - only show if logged in and not already revealed */}
      {isLoggedIn && !showFull && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setRevealed(!revealed)}
          className="w-full"
        >
          {revealed ? (
            <>
              <EyeOff className="w-4 h-4 mr-2" />
              Hide Details
            </>
          ) : (
            <>
              <Eye className="w-4 h-4 mr-2" />
              Show Full Details
            </>
          )}
        </Button>
      )}

      {/* Not logged in message */}
      {!isLoggedIn && !showFull && (
        <div className="bg-yellow-50 border border-yellow-200 rounded p-2 text-xs text-yellow-800">
          Sign in to see full contact details
        </div>
      )}
    </Card>
  );
};

interface MaskedContactDisplayProps {
  phone: string;
  email?: string;
  displayType?: "phone-only" | "email-only" | "both";
}

export const MaskedContactDisplay: React.FC<MaskedContactDisplayProps> = ({
  phone,
  email,
  displayType = "phone-only",
}) => {
  const maskedPhone = maskPhoneNumber(phone);
  const maskedEmail = email
    ? email.split("@")[0][0] + "****@" + email.split("@")[1]
    : null;

  return (
    <div className="inline-flex gap-2 text-sm">
      {(displayType === "phone-only" || displayType === "both") && (
        <span className="font-mono text-gray-700">{maskedPhone}</span>
      )}
      {(displayType === "email-only" || displayType === "both") &&
        maskedEmail && (
          <span className="font-mono text-gray-700">{maskedEmail}</span>
        )}
    </div>
  );
};

export default ContactInfo;
