
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface AnimatedCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  delay?: number;
  variant?: 'default' | 'gradient' | 'elevated';
}

const AnimatedCard: React.FC<AnimatedCardProps> = ({
  children,
  className,
  hover = true,
  delay = 0,
  variant = 'default'
}) => {
  const variants = {
    default: 'bg-white border-ulomu-beige-dark',
    gradient: 'bg-gradient-to-br from-white to-ulomu-beige border-ulomu-beige-dark',
    elevated: 'bg-white border-ulomu-beige-dark shadow-lg'
  };

  return (
    <Card 
      className={cn(
        variants[variant],
        "transition-all duration-300 ease-in-out animate-fade-in",
        hover && "hover:shadow-lg hover:scale-[1.02] hover:-translate-y-1",
        className
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </Card>
  );
};

export default AnimatedCard;
