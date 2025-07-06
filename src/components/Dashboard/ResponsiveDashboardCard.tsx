
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface ResponsiveDashboardCardProps {
  title: string;
  icon?: React.ReactNode;
  value: string | number;
  description?: string;
  className?: string;
  variant?: 'default' | 'terracotta' | 'forest' | 'gold';
  children?: React.ReactNode;
}

const ResponsiveDashboardCard: React.FC<ResponsiveDashboardCardProps> = ({
  title,
  icon,
  value,
  description,
  className,
  variant = 'default',
  children
}) => {
  const variantStyles = {
    default: 'bg-white border-ulomu-beige-dark',
    terracotta: 'bg-gradient-to-br from-terracotta/10 to-terracotta/20 border-terracotta/30',
    forest: 'bg-gradient-to-br from-forest/10 to-forest/20 border-forest/30',
    gold: 'bg-gradient-to-br from-ulomu-gold/10 to-ulomu-gold/20 border-ulomu-gold/30'
  };

  return (
    <Card className={cn(variantStyles[variant], "transition-all duration-200 hover:shadow-md", className)}>
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-center gap-3 mb-2 sm:mb-3">
          {icon && (
            <div className={cn(
              "p-2 rounded-lg flex-shrink-0",
              variant === 'terracotta' && "bg-terracotta",
              variant === 'forest' && "bg-forest",
              variant === 'gold' && "bg-ulomu-gold",
              variant === 'default' && "bg-gray-100"
            )}>
              {icon}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p className={cn(
              "text-sm font-medium truncate",
              variant === 'terracotta' && "text-terracotta",
              variant === 'forest' && "text-forest",
              variant === 'gold' && "text-ulomu-gold",
              variant === 'default' && "text-gray-700"
            )}>
              {title}
            </p>
            <p className={cn(
              "text-xl sm:text-2xl font-bold truncate",
              variant === 'terracotta' && "text-terracotta",
              variant === 'forest' && "text-forest",
              variant === 'gold' && "text-ulomu-gold",
              variant === 'default' && "text-gray-900"
            )}>
              {value}
            </p>
          </div>
        </div>
        {description && (
          <p className={cn(
            "text-xs truncate",
            variant === 'terracotta' && "text-terracotta/80",
            variant === 'forest' && "text-forest/80",
            variant === 'gold' && "text-ulomu-gold/80",
            variant === 'default' && "text-gray-500"
          )}>
            {description}
          </p>
        )}
        {children && (
          <div className="mt-3 sm:mt-4">
            {children}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ResponsiveDashboardCard;
