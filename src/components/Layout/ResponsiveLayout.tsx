
import React from 'react';
import { cn } from '@/lib/utils';

interface ResponsiveLayoutProps {
  children: React.ReactNode;
  className?: string;
  sidebar?: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
}

const ResponsiveLayout: React.FC<ResponsiveLayoutProps> = ({
  children,
  className,
  sidebar,
  header,
  footer
}) => {
  return (
    <div className={cn("min-h-screen flex flex-col", className)}>
      {header && (
        <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
          {header}
        </header>
      )}
      
      <div className="flex flex-1 overflow-hidden">
        {sidebar && (
          <aside className="hidden lg:flex lg:w-64 xl:w-80 flex-col border-r bg-card">
            <div className="flex-1 overflow-y-auto p-4">
              {sidebar}
            </div>
          </aside>
        )}
        
        <main className="flex-1 overflow-y-auto">
          <div className="container-responsive py-4 sm:py-6 lg:py-8">
            {children}
          </div>
        </main>
      </div>
      
      {footer && (
        <footer className="border-t bg-card">
          {footer}
        </footer>
      )}
    </div>
  );
};

export default ResponsiveLayout;
