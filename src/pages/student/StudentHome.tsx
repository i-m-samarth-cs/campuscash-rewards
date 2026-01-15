import { useState, useEffect } from 'react';
import { useNavigate, Routes, Route, Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Navbar } from '@/components/layout/Navbar';
import { StatsCard } from '@/components/shared/StatsCard';
import { TransactionRow } from '@/components/shared/TransactionRow';
import { EmptyState } from '@/components/shared/EmptyState';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { QrCode, Gift, History, Wallet, Loader2, Receipt } from 'lucide-react';
import { motion } from 'framer-motion';

interface Transaction {
  id: string;
  amount_inr: number;
  amount_bch: number;
  status: string;
  created_at: string;
  tx_hash: string | null;
  rewards_earned: number;
  vendors: { shop_name: string } | null;
}

const StudentDashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [totalRewards, setTotalRewards] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth?mode=login&role=student');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      // Fetch transactions
      const { data: txData } = await supabase
        .from('transactions')
        .select('*, vendors(shop_name)')
        .eq('student_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (txData) setTransactions(txData as Transaction[]);

      // Fetch total rewards
      const { data: rewardsData } = await supabase
        .from('rewards_ledger')
        .select('points_earned, points_type')
        .eq('user_id', user?.id);

      if (rewardsData) {
        const total = rewardsData.reduce((acc, r) => {
          return r.points_type === 'earned' ? acc + r.points_earned : acc - r.points_earned;
        }, 0);
        setTotalRewards(total);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  const todaySpent = transactions
    .filter(t => new Date(t.created_at).toDateString() === new Date().toDateString() && t.status === 'confirmed')
    .reduce((acc, t) => acc + Number(t.amount_inr), 0);

  return (
    <div className="min-h-screen bg-background pb-24">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 pt-4">
            <StatsCard
              title="Reward Points"
              value={totalRewards}
              subtitle="Available to redeem"
              icon={Gift}
              variant="primary"
            />
            <StatsCard
              title="Today's Spend"
              value={`₹${todaySpent.toFixed(0)}`}
              icon={Wallet}
            />
          </div>

          {/* Scan to Pay Button */}
          <Card className="gradient-primary border-0 shadow-lg overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-primary-foreground mb-1">
                    Ready to Pay?
                  </h3>
                  <p className="text-primary-foreground/80 text-sm">
                    Scan vendor QR to pay instantly
                  </p>
                </div>
                <Button 
                  variant="glass" 
                  size="lg"
                  onClick={() => navigate('/student/scan')}
                  className="bg-primary-foreground/20 hover:bg-primary-foreground/30 text-primary-foreground border-0"
                >
                  <QrCode size={20} />
                  Scan to Pay
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recent Transactions */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg">Recent Transactions</CardTitle>
              <Link to="/student/transactions">
                <Button variant="ghost" size="sm">View All</Button>
              </Link>
            </CardHeader>
            <CardContent className="space-y-3">
              {transactions.length === 0 ? (
                <EmptyState
                  icon={Receipt}
                  title="No transactions yet"
                  description="Your payment history will appear here"
                />
              ) : (
                transactions.slice(0, 3).map((tx) => (
                  <TransactionRow
                    key={tx.id}
                    type="sent"
                    vendorName={tx.vendors?.shop_name || 'Unknown'}
                    amountInr={Number(tx.amount_inr)}
                    amountBch={Number(tx.amount_bch)}
                    status={tx.status}
                    date={tx.created_at}
                    txHash={tx.tx_hash || undefined}
                    rewardsEarned={tx.rewards_earned}
                  />
                ))
              )}
            </CardContent>
          </Card>
        </motion.div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border safe-area-pb">
        <div className="flex items-center justify-around py-2">
          <NavItem icon={Wallet} label="Home" to="/student" />
          <NavItem icon={QrCode} label="Scan" to="/student/scan" />
          <NavItem icon={Gift} label="Rewards" to="/student/rewards" />
          <NavItem icon={History} label="History" to="/student/transactions" />
        </div>
      </nav>
    </div>
  );
};

const NavItem = ({ icon: Icon, label, to }: { icon: any; label: string; to: string }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link 
      to={to}
      className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
        isActive ? 'text-primary' : 'text-muted-foreground'
      }`}
    >
      <Icon size={20} />
      <span className="text-xs font-medium">{label}</span>
    </Link>
  );
};

const StudentHome = () => {
  return (
    <Routes>
      <Route path="/" element={<StudentDashboard />} />
      <Route path="/scan" element={<StudentDashboard />} />
      <Route path="/rewards" element={<StudentDashboard />} />
      <Route path="/transactions" element={<StudentDashboard />} />
    </Routes>
  );
};

export default StudentHome;
