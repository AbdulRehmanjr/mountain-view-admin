"use client";

import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

interface CustomButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  type: "button" | "submit";
  title: string;
  className?: string;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  size?: "default" | "sm" | "lg" | "icon";
}

export const ShadcnButton: React.FC<CustomButtonProps> = ({
  type,
  title,
  className,
  variant = "default",
  size = "default",
  ...props
}) => {
  return (
    <Button
      className={cn(
        "bg-gradient-to-br from-blue-400 to-purple-500 text-sm sm:text-base",
        "hover:bg-gradient-to-br hover:from-blue-500 hover:to-purple-600",
        "transition-all duration-200 ease-in-out",
        "font-semibold text-white shadow-md",
        className,
      )}
      variant={variant}
      size={size}
      {...props}
      type={type}
    >
      {title}
    </Button>
  );
};
