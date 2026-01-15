import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Logo } from './Logo';
import { useAuth } from '@/hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, role, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const getDashboardLink = () => {
    if (role === 'vendor') return '/vendor';
    if (role === 'student') return '/student';
    return '/';
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Logo />
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {user ? (
              <>
                <Link 
                  to={getDashboardLink()} 
                  className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
                >
                  Dashboard
                </Link>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary">
                    <User size={16} className="text-secondary-foreground" />
                    <span className="text-sm font-medium text-secondary-foreground capitalize">
                      {role}
                    </span>
                  </div>
                  <Button variant="ghost" size="sm" onClick={handleSignOut}>
                    <LogOut size={18} />
                    Sign Out
                  </Button>
                </div>
              </>
            ) : (
              <>
                <Link to="/auth?mode=login&role=student">
                  <Button variant="ghost">Student Login</Button>
                </Link>
                <Link to="/auth?mode=login&role=vendor">
                  <Button variant="outline">Vendor Login</Button>
                </Link>
                <Link to="/auth?mode=signup&role=student">
                  <Button variant="hero">Get Started</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2" 
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass border-t border-border/50"
          >
            <div className="container mx-auto px-4 py-4 space-y-3">
              {user ? (
                <>
                  <Link 
                    to={getDashboardLink()} 
                    className="block py-2 text-foreground/80 hover:text-foreground transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <div className="flex items-center gap-2 py-2">
                    <User size={16} className="text-secondary-foreground" />
                    <span className="text-sm font-medium capitalize">{role}</span>
                  </div>
                  <Button variant="ghost" className="w-full justify-start" onClick={handleSignOut}>
                    <LogOut size={18} />
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/auth?mode=login&role=student" onClick={() => setIsOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start">
                      Student Login
                    </Button>
                  </Link>
                  <Link to="/auth?mode=login&role=vendor" onClick={() => setIsOpen(false)}>
                    <Button variant="outline" className="w-full justify-start">
                      Vendor Login
                    </Button>
                  </Link>
                  <Link to="/auth?mode=signup&role=student" onClick={() => setIsOpen(false)}>
                    <Button variant="hero" className="w-full">
                      Get Started
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
