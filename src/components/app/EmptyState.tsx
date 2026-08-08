"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface EmptyStateProps {
  emoji?: string;
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export default function EmptyState({ emoji, icon, title, description, action, className }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("flex flex-col items-center justify-center text-center py-12 px-4", className)}
    >
      <div className="w-14 h-14 rounded-full bg-muted/40 flex items-center justify-center mb-4">
        {emoji ? <span className="text-2xl">{emoji}</span> : icon}
      </div>
      <div className="font-serif text-lg text-moss-deep mb-1">{title}</div>
      {description && (
        <div className="text-xs text-muted-foreground max-w-xs leading-relaxed">{description}</div>
      )}
      {action && (
        <Button
          variant="ghost"
          size="sm"
          onClick={action.onClick}
          className="mt-4 text-moss hover:bg-moss/10 rounded-full"
        >
          {action.label} <ArrowRight className="ml-1.5 w-3 h-3" />
        </Button>
      )}
    </motion.div>
  );
}
