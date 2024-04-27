"use client";

import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";


interface CourseProgressProps {
  value: number;
  variant?: "default" | "success",
  size?: "default" | "sm";
};

const colorByVariant = {
  default: "text-primary",
  success: "text-emerald-700",
}

const sizeByVariant = {
  default: "text-sm",
  sm: "text-xs",
}

export const ProgramProgress = ({
  value,
  variant,
  size,
}: CourseProgressProps) => {

  return (
    <div>
      <Progress
        className="h-2 bg-secondary"
        value={value}
      />
      <p className={cn(
        "font-medium mt-2 text-primary",
        colorByVariant[variant || "default"],
        sizeByVariant[size || "default"],
      )}>
        {Math.round(value)}% completed
      </p>
    </div>
  )
}