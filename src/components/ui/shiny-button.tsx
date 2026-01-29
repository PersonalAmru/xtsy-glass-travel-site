/**
 * ShinyButton - Premium animated button with gradient border effect
 * Adapted for Vite/React projects (no styled-jsx)
 */

import type React from "react";
import { cn } from "@/lib/utils";
import "./shiny-button.css";

interface ShinyButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  size?: "sm" | "md" | "lg";
}

export function ShinyButton({ 
  children, 
  onClick, 
  className = "",
  disabled = false,
  type = "button",
  size = "md"
}: ShinyButtonProps) {
  const sizeClasses = {
    sm: "shiny-cta--sm",
    md: "",
    lg: "shiny-cta--lg"
  };

  return (
    <button 
      type={type}
      className={cn("shiny-cta", sizeClasses[size], className)}
      onClick={onClick}
      disabled={disabled}
    >
      <span>{children}</span>
    </button>
  );
}

export default ShinyButton;
