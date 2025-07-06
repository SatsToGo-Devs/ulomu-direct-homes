
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { ChevronRight, Zap } from 'lucide-react';

interface QuickAction {
  icon: React.ComponentType<any>;
  label: string;
  route: string;
  color: string;
  description: string;
  badge?: string;
}

interface MobileOptimizedQuickActionsProps {
  title: string;
  actions: QuickAction[];
  roleColor?: 'terracotta' | 'forest' | 'gold';
  variant?: 'grid' | 'list';
}

const MobileOptimizedQuickActions: React.FC<MobileOptimizedQuickActionsProps> = ({
  title,
  actions,
  roleColor = 'terracotta',
  variant = 'grid'
}) => {
  const navigate = useNavigate();
  
  const roleColorStyles = {
    terracotta: 'text-terracotta',
    forest: 'text-forest',
    gold: 'text-ulomu-gold'
  };

  const hoverColorStyles = {
    terracotta: 'hover:border-l-terracotta hover:bg-terracotta/5',
    forest: 'hover:border-l-forest hover:bg-forest/5',
    gold: 'hover:border-l-ulomu-gold hover:bg-ulomu-gold/5'
  };

  return (
    <Card className="bg-white border-ulomu-beige-dark shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className={cn("flex items-center gap-2 text-lg sm:text-xl", roleColorStyles[roleColor])}>
          <Zap className="h-5 w-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className={cn(
          variant === 'grid' 
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4"
            : "space-y-3"
        )}>
          {actions.map((action, index) => (
            <Card 
              key={index}
              className={cn(
                "hover:shadow-md transition-all duration-300 ease-in-out cursor-pointer group border-l-4 border-l-transparent bg-gradient-to-r from-ulomu-beige to-white",
                hoverColorStyles[roleColor],
                "animate-fade-in"
              )}
              style={{ animationDelay: `${index * 100}ms` }}
              onClick={() => navigate(action.route)}
            >
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    `p-2 sm:p-3 ${action.color} rounded-lg group-hover:scale-110 transition-all duration-300 flex-shrink-0 shadow-sm`
                  )}>
                    <action.icon className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">
                        {action.label}
                      </h3>
                      {action.badge && (
                        <span className="bg-terracotta text-white text-xs px-2 py-1 rounded-full ml-2 flex-shrink-0">
                          {action.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600 line-clamp-2 mb-2">
                      {action.description}
                    </p>
                    <div className="flex items-center text-xs text-gray-500 group-hover:text-gray-700 transition-colors duration-200">
                      <span>Quick access</span>
                      <ChevronRight className="h-3 w-3 ml-1 group-hover:translate-x-1 transition-transform duration-200" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default MobileOptimizedQuickActions;
