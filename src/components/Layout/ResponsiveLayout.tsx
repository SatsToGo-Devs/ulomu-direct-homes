
import React from 'react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

interface ResponsiveLayoutProps {
  children: React.ReactNode;
  className?: string;
  sidebar?: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  sidebarCollapsed?: boolean;
  onSidebarToggle?: () => void;
}

const ResponsiveLayout: React.FC<ResponsiveLayoutProps> = ({
  children,
  className,
  sidebar,
  header,
  footer,
  sidebarCollapsed = false,
  onSidebarToggle
}) => {
  const isMobile = useIsMobile();

  return (
    <div className={cn("min-h-screen flex flex-col bg-ulomu-beige", className)}>
      {header && (
        <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-ulomu-beige-dark">
          <div className="container-responsive">
            {header}
          </div>
        </header>
      )}
      
      <div className="flex flex-1 overflow-hidden">
        {sidebar && !isMobile && (
          <aside className={cn(
            "flex flex-col border-r border-ulomu-beige-dark bg-white transition-all duration-300",
            sidebarCollapsed ? "w-16" : "w-64 lg:w-80"
          )}>
            <div className="flex-1 overflow-y-auto p-2 sm:p-4">
              {sidebar}
            </div>
          </aside>
        )}
        
        <main className="flex-1 overflow-y-auto">
          <div className="container-responsive py-4 sm:py-6 lg:py-8 space-y-6">
            {children}
          </div>
        </main>
      </div>
      
      {footer && (
        <footer className="border-t border-ulomu-beige-dark bg-white">
          <div className="container-responsive py-4">
            {footer}
          </div>
        </footer>
      )}

      {/* Mobile sidebar overlay */}
      {sidebar && isMobile && !sidebarCollapsed && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={onSidebarToggle}
          />
          <aside className="fixed left-0 top-0 bottom-0 w-80 max-w-[85vw] bg-white border-r border-ulomu-beige-dark z-50 lg:hidden transform transition-transform duration-300">
            <div className="flex-1 overflow-y-auto p-4">
              {sidebar}
            </div>
          </aside>
        </>
      )}
    </div>
  );
};

export default ResponsiveLayout;
