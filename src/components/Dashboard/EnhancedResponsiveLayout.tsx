
import React from 'react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EnhancedResponsiveLayoutProps {
  children: React.ReactNode;
  className?: string;
  sidebar?: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  sidebarCollapsed?: boolean;
  onSidebarToggle?: () => void;
}

const EnhancedResponsiveLayout: React.FC<EnhancedResponsiveLayoutProps> = ({
  children,
  className,
  sidebar,
  header,
  footer,
  sidebarCollapsed = false,
  onSidebarToggle
}) => {
  const isMobile = useIsMobile();
  const [mobileSidebarOpen, setMobileSidebarOpen] = React.useState(false);

  const toggleMobileSidebar = () => {
    setMobileSidebarOpen(!mobileSidebarOpen);
    onSidebarToggle?.();
  };

  return (
    <div className={cn("min-h-screen flex flex-col bg-ulomu-beige transition-all duration-300 ease-in-out", className)}>
      {/* Enhanced Header with Mobile Menu */}
      {header && (
        <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md supports-[backdrop-filter]:bg-white/80 border-b border-ulomu-beige-dark shadow-sm transition-all duration-300">
          <div className="container-responsive">
            <div className="flex items-center justify-between py-3 sm:py-4">
              {isMobile && sidebar && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleMobileSidebar}
                  className="p-2 hover:bg-ulomu-beige transition-colors duration-200"
                >
                  {mobileSidebarOpen ? (
                    <X className="h-5 w-5 text-gray-600" />
                  ) : (
                    <Menu className="h-5 w-5 text-gray-600" />
                  )}
                </Button>
              )}
              <div className="flex-1">
                {header}
              </div>
            </div>
          </div>
        </header>
      )}
      
      <div className="flex flex-1 overflow-hidden">
        {/* Desktop Sidebar */}
        {sidebar && !isMobile && (
          <aside className={cn(
            "flex flex-col border-r border-ulomu-beige-dark bg-white shadow-sm transition-all duration-300 ease-in-out",
            sidebarCollapsed ? "w-16" : "w-64 lg:w-80"
          )}>
            <div className="flex-1 overflow-y-auto p-2 sm:p-4 space-y-2">
              {sidebar}
            </div>
          </aside>
        )}
        
        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-ulomu-beige">
          <div className="container-responsive py-4 sm:py-6 lg:py-8 space-y-6 animate-fade-in">
            {children}
          </div>
        </main>
      </div>
      
      {/* Enhanced Footer */}
      {footer && (
        <footer className="border-t border-ulomu-beige-dark bg-white shadow-sm transition-all duration-300">
          <div className="container-responsive py-4">
            {footer}
          </div>
        </footer>
      )}

      {/* Mobile Sidebar Overlay */}
      {sidebar && isMobile && (
        <>
          {/* Backdrop */}
          {mobileSidebarOpen && (
            <div 
              className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ease-in-out animate-fade-in"
              onClick={toggleMobileSidebar}
            />
          )}
          
          {/* Mobile Sidebar */}
          <aside className={cn(
            "fixed left-0 top-0 bottom-0 w-80 max-w-[85vw] bg-white border-r border-ulomu-beige-dark z-50 shadow-2xl transition-transform duration-300 ease-in-out",
            mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
          )}>
            <div className="flex items-center justify-between p-4 border-b border-ulomu-beige-dark">
              <h2 className="font-semibold text-gray-900">Menu</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleMobileSidebar}
                className="p-2 hover:bg-ulomu-beige transition-colors duration-200"
              >
                <X className="h-5 w-5 text-gray-600" />
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {sidebar}
            </div>
          </aside>
        </>
      )}
    </div>
  );
};

export default EnhancedResponsiveLayout;
