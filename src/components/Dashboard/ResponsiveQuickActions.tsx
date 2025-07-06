
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { TrendingUp } from 'lucide-react';

interface QuickAction {
  icon: React.ComponentType<any>;
  label: string;
  route: string;
  color: string;
  description: string;
}

interface ResponsiveQuickActionsProps {
  title: string;
  actions: QuickAction[];
  roleColor?: 'terracotta' | 'forest' | 'gold';
}

const ResponsiveQuickActions: React.FC<ResponsiveQuickActionsProps> = ({
  title,
  actions,
  roleColor = 'terracotta'
}) => {
  const navigate = useNavigate();
  
  const roleColorStyles = {
    terracotta: 'text-terracotta',
    forest: 'text-forest',
    gold: 'text-ulomu-gold'
  };

  const hoverColorStyles = {
    terracotta: 'hover:border-l-terracotta',
    forest: 'hover:border-l-forest',
    gold: 'hover:border-l-ulomu-gold'
  };

  return (
    <Card className="bg-white border-ulomu-beige-dark">
      <CardHeader className="pb-4">
        <CardTitle className={cn("flex items-center gap-2", roleColorStyles[roleColor])}>
          <TrendingUp className="h-5 w-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {actions.map((action, index) => (
            <Card 
              key={index}
              className={cn(
                "hover:shadow-lg transition-all duration-200 cursor-pointer group border-l-4 border-l-transparent bg-ulomu-beige",
                hoverColorStyles[roleColor]
              )}
              onClick={() => navigate(action.route)}
            >
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-start gap-3">
                  <div className={cn(
                    `p-2 ${action.color} rounded-lg group-hover:scale-110 transition-transform flex-shrink-0`
                  )}>
                    <action.icon className="h-4 w-4 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">
                      {action.label}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-500 mt-1 line-clamp-2">
                      {action.description}
                    </p>
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

export default ResponsiveQuickActions;
