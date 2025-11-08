import React from "react";
import { Badge } from "@/components/ui/badge";
import { ItemStatus } from "@/types";
import { Clock, CheckCircle, Archive } from "lucide-react";

interface StatusBadgeProps {
  status: ItemStatus;
  size?: "sm" | "md" | "lg";
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = "md",
}) => {
  const statusConfig = {
    active: {
      label: "Active",
      color: "bg-green-100 text-green-800",
      icon: <Clock className="w-4 h-4" />,
    },
    resolved: {
      label: "Resolved",
      color: "bg-blue-100 text-blue-800",
      icon: <CheckCircle className="w-4 h-4" />,
    },
    archived: {
      label: "Archived",
      color: "bg-gray-100 text-gray-800",
      icon: <Archive className="w-4 h-4" />,
    },
  };

  const config = statusConfig[status];
  const sizeClasses = {
    sm: "text-xs px-2 py-1",
    md: "text-sm px-3 py-1.5",
    lg: "text-base px-4 py-2",
  };

  return (
    <Badge className={`${config.color} ${sizeClasses[size]} gap-1.5`}>
      {config.icon}
      <span>{config.label}</span>
    </Badge>
  );
};

interface StatusSelectProps {
  value: ItemStatus;
  onChange: (status: ItemStatus) => void;
  disabled?: boolean;
}

export const StatusSelect: React.FC<StatusSelectProps> = ({
  value,
  onChange,
  disabled = false,
}) => {
  const statuses: ItemStatus[] = ["active", "resolved", "archived"];

  return (
    <div className="flex gap-2">
      {statuses.map((status) => (
        <button
          key={status}
          onClick={() => onChange(status)}
          disabled={disabled}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            value === status
              ? "bg-blue-500 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
        >
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </button>
      ))}
    </div>
  );
};

interface StatusTimelineProps {
  createdAt: string;
  resolvedAt?: string;
  archivedAt?: string;
}

export const StatusTimeline: React.FC<StatusTimelineProps> = ({
  createdAt,
  resolvedAt,
  archivedAt,
}) => {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-3">
      <div className="flex items-start gap-4">
        <div className="flex flex-col items-center">
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <div className="w-0.5 h-8 bg-gray-200" />
        </div>
        <div>
          <p className="font-medium text-sm">Posted</p>
          <p className="text-xs text-gray-600">{formatDate(createdAt)}</p>
        </div>
      </div>

      {resolvedAt && (
        <>
          <div className="flex items-start gap-4">
            <div className="flex flex-col items-center">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              {archivedAt && <div className="w-0.5 h-8 bg-gray-200" />}
            </div>
            <div>
              <p className="font-medium text-sm">Resolved</p>
              <p className="text-xs text-gray-600">{formatDate(resolvedAt)}</p>
            </div>
          </div>
        </>
      )}

      {archivedAt && (
        <div className="flex items-start gap-4">
          <div className="w-3 h-3 rounded-full bg-gray-400" />
          <div>
            <p className="font-medium text-sm">Archived</p>
            <p className="text-xs text-gray-600">{formatDate(archivedAt)}</p>
          </div>
        </div>
      )}
    </div>
  );
};
