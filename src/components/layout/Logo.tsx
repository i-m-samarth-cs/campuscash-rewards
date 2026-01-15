import { Coins } from 'lucide-react';
import { Link } from 'react-router-dom';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export const Logo = ({ size = 'md', showText = true }: LogoProps) => {
  const sizes = {
    sm: { icon: 20, text: 'text-lg' },
    md: { icon: 28, text: 'text-xl' },
    lg: { icon: 40, text: 'text-3xl' },
  };

  return (
    <Link to="/" className="flex items-center gap-2 group">
      <div className="relative">
        <div className="gradient-primary p-2 rounded-xl shadow-lg group-hover:shadow-glow transition-shadow duration-300">
          <Coins size={sizes[size].icon} className="text-primary-foreground" />
        </div>
        <div className="absolute -top-1 -right-1 w-3 h-3 gradient-accent rounded-full animate-pulse" />
      </div>
      {showText && (
        <div className="flex flex-col">
          <span className={`font-bold ${sizes[size].text} text-gradient-primary`}>
            CampusCash
          </span>
          <span className="text-xs font-semibold text-accent -mt-1">BCH</span>
        </div>
      )}
    </Link>
  );
};
