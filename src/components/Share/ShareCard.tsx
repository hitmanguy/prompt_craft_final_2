import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Share2, MessageCircle, Copy, Check } from "lucide-react";
import {
  getWhatsAppShareLink,
  getTelegramShareLink,
  generateShareURL,
  copyToClipboard,
} from "@/lib/helpers";
import { toast } from "sonner";

interface ShareCardProps {
  itemId: string;
  itemTitle: string;
  size?: "sm" | "md" | "lg";
  layout?: "horizontal" | "vertical";
}

export const ShareCard: React.FC<ShareCardProps> = ({
  itemId,
  itemTitle,
  size = "md",
  layout = "horizontal",
}) => {
  const [copied, setCopied] = useState(false);

  const shareURL = generateShareURL(itemId);
  const whatsappLink = getWhatsAppShareLink(itemId, itemTitle);
  const telegramLink = getTelegramShareLink(itemId, itemTitle);

  const handleCopyLink = async () => {
    if (await copyToClipboard(shareURL)) {
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } else {
      toast.error("Failed to copy link");
    }
  };

  const buttonSize = {
    sm: "h-8 text-xs",
    md: "h-9 text-sm",
    lg: "h-10 text-base",
  };

  const iconSize = {
    sm: "w-3.5 h-3.5",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  const containerClass = layout === "vertical" ? "flex-col" : "flex-row";

  return (
    <div className={`flex ${containerClass} gap-2`}>
      <Button
        size={size === "sm" ? "sm" : size === "lg" ? "lg" : "default"}
        variant="outline"
        onClick={handleCopyLink}
        className={buttonSize[size]}
      >
        {copied ? (
          <>
            <Check className={`${iconSize[size]} mr-1.5`} />
            Copied!
          </>
        ) : (
          <>
            <Copy className={`${iconSize[size]} mr-1.5`} />
            Copy Link
          </>
        )}
      </Button>

      <a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex"
      >
        <Button
          size={size === "sm" ? "sm" : size === "lg" ? "lg" : "default"}
          className={buttonSize[size]}
        >
          <MessageCircle className={`${iconSize[size]} mr-1.5`} />
          WhatsApp
        </Button>
      </a>

      <a
        href={telegramLink}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex"
      >
        <Button
          size={size === "sm" ? "sm" : size === "lg" ? "lg" : "default"}
          variant="outline"
          className={buttonSize[size]}
        >
          <Share2 className={`${iconSize[size]} mr-1.5`} />
          Telegram
        </Button>
      </a>
    </div>
  );
};

interface ShareButtonProps {
  itemId: string;
  itemTitle: string;
  icon?: boolean;
}

export const ShareButton: React.FC<ShareButtonProps> = ({
  itemId,
  itemTitle,
  icon = false,
}) => {
  const shareURL = generateShareURL(itemId);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: itemTitle,
          text: `Check out this item on ReUniteMe: ${itemTitle}`,
          url: shareURL,
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      // Fallback to copy
      if (await copyToClipboard(shareURL)) {
        toast.success("Link copied to clipboard!");
      }
    }
  };

  return (
    <Button onClick={handleShare} variant="outline" size="sm">
      {icon ? (
        <Share2 className="w-4 h-4" />
      ) : (
        <>
          <Share2 className="w-4 h-4 mr-2" />
          Share
        </>
      )}
    </Button>
  );
};

export default ShareCard;
