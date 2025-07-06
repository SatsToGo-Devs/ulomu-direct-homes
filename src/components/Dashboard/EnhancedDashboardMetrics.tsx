
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface MetricProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    label: string;
  };
  icon?: React.ReactNode;
  variant?: 'default' | 'terracotta' | 'forest' | 'gold';
  loading?: boolean;
}

const EnhancedDashboardMetrics: React.FC<MetricProps> = ({
  title,
  value,
  change,
  icon,
  variant = 'default',
  loading = false
}) => {
  const variantStyles = {
    default: {
      bg: 'bg-white',
      border: 'border-ulomu-beige-dark',
      iconBg: 'bg-gray-100',
      textColor: 'text-gray-700',
      valueColor: 'text-gray-900'
    },
    terracotta: {
      bg: 'bg-gradient-to-br from-terracotta/5 to-terracotta/10',
      border: 'border-terracotta/20',
      iconBg: 'bg-terracotta',
      textColor: 'text-terracotta',
      valueColor: 'text-terracotta'
    },
    forest: {
      bg: 'bg-gradient-to-br from-forest/5 to-forest/10',
      border: 'border-forest/20',
      iconBg: 'bg-forest',
      textColor: 'text-forest',
      valueColor: 'text-forest'
    },
    gold: {
      bg: 'bg-gradient-to-br from-ulomu-gold/5 to-ulomu-gold/10',
      border: 'border-ulomu-gold/20',
      iconBg: 'bg-ulomu-gold',
      textColor: 'text-ulomu-gold',
      valueColor: 'text-ulomu-gold'
    }
  };

  const styles = variantStyles[variant];

  const getTrendIcon = () => {
    if (!change) return null;
    if (change.value > 0) return <TrendingUp className="h-3 w-3 text-green-500" />;
    if (change.value < 0) return <TrendingDown className="h-3 w-3 text-red-500" />;
    return <Minus className="h-3 w-3 text-gray-500" />;
  };

  const getTrendColor = () => {
    if (!change) return 'text-gray-500';
    if (change.value > 0) return 'text-green-600';
    if (change.value < 0) return 'text-red-600';
    return 'text-gray-500';
  };

  if (loading) {
    return (
      <Card className={cn(styles.bg, styles.border, "animate-pulse")}>
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
              <div className="h-6 bg-gray-200 rounded w-16"></div>
            </div>
          </div>
          {change && <div className="h-3 bg-gray-200 rounded w-24"></div>}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn(
      styles.bg,
      styles.border,
      "transition-all duration-300 ease-in-out hover:shadow-md hover:scale-[1.02] animate-fade-in group"
    )}>
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-center gap-3 mb-3">
          {icon && (
            <div className={cn(
              styles.iconBg,
              "p-2 rounded-lg transition-transform duration-200 group-hover:scale-110"
            )}>
              {icon}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className={cn(
              "text-sm font-medium truncate transition-colors duration-200",
              styles.textColor
            )}>
              {title}
            </p>
            <p className={cn(
              "text-xl sm:text-2xl font-bold truncate transition-all duration-300",
              styles.valueColor
            )}>
              {value}
            </p>
          </div>
        </div>
        
        {change && (
          <div className="flex items-center gap-1">
            {getTrendIcon()}
            <span className={cn("text-xs font-medium", getTrendColor())}>
              {change.value > 0 ? '+' : ''}{change.value}% {change.label}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EnhancedDashboardMetrics;
