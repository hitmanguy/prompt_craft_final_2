import React from "react";
import { Badge } from "@/components/ui/badge";
import { ItemCategory } from "@/types";
import {
  getCategoryColor,
  getCategoryIcon,
  getCategoryLabel,
} from "@/lib/categories";

interface CategoryBadgeProps {
  category: ItemCategory;
  size?: "sm" | "md" | "lg";
  clickable?: boolean;
  onClick?: () => void;
}

export const CategoryBadge: React.FC<CategoryBadgeProps> = ({
  category,
  size = "md",
  clickable = false,
  onClick,
}) => {
  const icon = getCategoryIcon(category);
  const label = getCategoryLabel(category);
  const color = getCategoryColor(category);

  const sizeClasses = {
    sm: "text-xs gap-1",
    md: "text-sm gap-1.5",
    lg: "text-base gap-2",
  };

  return (
    <Badge
      className={`${color} ${sizeClasses[size]} ${
        clickable ? "cursor-pointer hover:opacity-80" : ""
      }`}
      onClick={onClick}
    >
      {icon}
      <span>{label}</span>
    </Badge>
  );
};

interface CategorySelectProps {
  value: ItemCategory;
  onChange: (category: ItemCategory) => void;
  disabled?: boolean;
}

export const CategorySelect: React.FC<CategorySelectProps> = ({
  value,
  onChange,
  disabled = false,
}) => {
  const { ALL_CATEGORIES } = require("@/lib/categories");

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
      {ALL_CATEGORIES.map((category: ItemCategory) => (
        <button
          key={category}
          onClick={() => onChange(category)}
          disabled={disabled}
          className={`p-3 rounded-lg border-2 transition-all ${
            value === category
              ? "border-blue-500 bg-blue-50"
              : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
          } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
        >
          <div className="flex flex-col items-center gap-2">
            <div className="text-2xl">{getCategoryIcon(category)}</div>
            <span className="text-xs font-medium text-center">
              {getCategoryLabel(category)}
            </span>
          </div>
        </button>
      ))}
    </div>
  );
};

interface CategoryFilterProps {
  selected: ItemCategory[];
  onChange: (categories: ItemCategory[]) => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selected,
  onChange,
}) => {
  const { ALL_CATEGORIES } = require("@/lib/categories");

  const handleToggle = (category: ItemCategory) => {
    if (selected.includes(category)) {
      onChange(selected.filter((c) => c !== category));
    } else {
      onChange([...selected, category]);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {ALL_CATEGORIES.map((category: ItemCategory) => (
        <button
          key={category}
          onClick={() => handleToggle(category)}
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
            selected.includes(category)
              ? "bg-blue-500 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          {getCategoryLabel(category)}
        </button>
      ))}
    </div>
  );
};
