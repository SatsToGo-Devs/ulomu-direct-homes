
import React from 'react';

interface UlomuLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
}

const UlomuLogo: React.FC<UlomuLogoProps> = ({ 
  size = 'md', 
  showText = true, 
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl'
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <div className={`${sizeClasses[size]} relative`}>
        <svg
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Background circle with gradient */}
          <defs>
            <linearGradient id="ulomuGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#C45B39" />
              <stop offset="100%" stopColor="#2C5530" />
            </linearGradient>
          </defs>
          
          {/* Main circle */}
          <circle 
            cx="20" 
            cy="20" 
            r="18" 
            fill="url(#ulomuGradient)"
            stroke="#D4A64A"
            strokeWidth="2"
          />
          
          {/* Stylized "U" */}
          <path
            d="M12 14 L12 22 Q12 26 16 26 L24 26 Q28 26 28 22 L28 14"
            stroke="white"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
          />
          
          {/* Small accent dot */}
          <circle cx="20" cy="30" r="1.5" fill="#D4A64A" />
        </svg>
      </div>
      
      {showText && (
        <span className={`font-bold ${textSizeClasses[size]} text-forest dark:text-white`}>
          Ulomu
        </span>
      )}
    </div>
  );
};

export default UlomuLogo;
