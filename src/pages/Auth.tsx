import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Logo } from '@/components/layout/Logo';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { VENDOR_TYPES } from '@/lib/constants';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const Auth = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, role, signUp, signIn } = useAuth();
  const { toast } = useToast();

  const [mode, setMode] = useState<'login' | 'signup'>(
    (searchParams.get('mode') as 'login' | 'signup') || 'login'
  );
  const [userRole, setUserRole] = useState<'student' | 'vendor'>(
    (searchParams.get('role') as 'student' | 'vendor') || 'student'
  );
  const [loading, setLoading] = useState(false);

  // Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [collegeId, setCollegeId] = useState('');
  const [bchWallet, setBchWallet] = useState('');
  const [shopName, setShopName] = useState('');
  const [vendorType, setVendorType] = useState('canteen');
  const [bchAddress, setBchAddress] = useState('');

  useEffect(() => {
    if (user && role) {
      navigate(role === 'vendor' ? '/vendor' : '/student');
    }
  }, [user, role, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === 'signup') {
        const additionalData = userRole === 'vendor'
          ? { shopName, vendorType, bchAddress }
          : { collegeId, bchWallet };

        const { error } = await signUp(email, password, fullName, userRole, additionalData);
        
        if (error) {
          toast({
            title: 'Signup Failed',
            description: error.message,
            variant: 'destructive',
          });
        } else {
          toast({
            title: 'Welcome!',
            description: 'Account created successfully.',
          });
        }
      } else {
        const { error } = await signIn(email, password);
        
        if (error) {
          toast({
            title: 'Login Failed',
            description: error.message,
            variant: 'destructive',
          });
        }
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="absolute inset-0 gradient-hero opacity-5" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative"
      >
        <div className="mb-8 text-center">
          <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft size={16} />
            Back to Home
          </Link>
          <div className="flex justify-center mb-4">
            <Logo size="lg" />
          </div>
        </div>

        <Card className="border-0 shadow-xl">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-2xl">
              {mode === 'login' ? 'Welcome Back' : 'Create Account'}
            </CardTitle>
            <CardDescription>
              {mode === 'login' 
                ? `Sign in to your ${userRole} account` 
                : `Register as a ${userRole}`}
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {/* Role Toggle */}
            <div className="flex gap-2 p-1 bg-muted rounded-lg mb-6">
              <button
                type="button"
                onClick={() => setUserRole('student')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                  userRole === 'student' 
                    ? 'bg-card shadow-sm text-foreground' 
                    : 'text-muted-foreground'
                }`}
              >
                Student
              </button>
              <button
                type="button"
                onClick={() => setUserRole('vendor')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                  userRole === 'vendor' 
                    ? 'bg-card shadow-sm text-foreground' 
                    : 'text-muted-foreground'
                }`}
              >
                Vendor
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'signup' && (
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="John Doe"
                    required
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
              </div>

              {mode === 'signup' && userRole === 'student' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="collegeId">College ID (Optional)</Label>
                    <Input
                      id="collegeId"
                      value={collegeId}
                      onChange={(e) => setCollegeId(e.target.value)}
                      placeholder="STU-2025-001"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bchWallet">BCH Wallet Address (Optional)</Label>
                    <Input
                      id="bchWallet"
                      value={bchWallet}
                      onChange={(e) => setBchWallet(e.target.value)}
                      placeholder="bitcoincash:..."
                    />
                  </div>
                </>
              )}

              {mode === 'signup' && userRole === 'vendor' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="shopName">Shop Name</Label>
                    <Input
                      id="shopName"
                      value={shopName}
                      onChange={(e) => setShopName(e.target.value)}
                      placeholder="Canteen A"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="vendorType">Vendor Type</Label>
                    <Select value={vendorType} onValueChange={setVendorType}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {VENDOR_TYPES.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bchAddress">BCH Receiving Address</Label>
                    <Input
                      id="bchAddress"
                      value={bchAddress}
                      onChange={(e) => setBchAddress(e.target.value)}
                      placeholder="bitcoincash:..."
                      required
                    />
                  </div>
                </>
              )}

              <Button type="submit" variant="hero" className="w-full" disabled={loading}>
                {loading && <Loader2 className="animate-spin" size={18} />}
                {mode === 'login' ? 'Sign In' : 'Create Account'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}
                <button
                  type="button"
                  onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                  className="ml-1 text-primary font-medium hover:underline"
                >
                  {mode === 'login' ? 'Sign up' : 'Sign in'}
                </button>
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Auth;
