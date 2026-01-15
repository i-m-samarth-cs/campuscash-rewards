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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { QRCodeSVG } from 'qrcode.react';
import { Plus, Receipt, TrendingUp, Clock, Loader2, LayoutDashboard, History, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';
import { inrToBch, generateInvoiceId } from '@/lib/constants';
import { useToast } from '@/hooks/use-toast';

interface Vendor {
  id: string;
  shop_name: string;
  vendor_type: string;
  bch_address: string;
}

interface Invoice {
  id: string;
  invoice_id: string;
  amount_inr: number;
  amount_bch: number;
  note: string | null;
  status: string;
  created_at: string;
  bch_address: string;
}

const VendorHome = () => {
  const { user, role, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [qrDialogOpen, setQrDialogOpen] = useState(false);
  const [currentQrData, setCurrentQrData] = useState<string>('');
  
  // Create bill form
  const [amountInr, setAmountInr] = useState('');
  const [note, setNote] = useState('');
  const [studentId, setStudentId] = useState('');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (!authLoading && (!user || role !== 'vendor')) {
      navigate('/auth?mode=login&role=vendor');
    }
  }, [user, role, authLoading, navigate]);

  useEffect(() => {
    if (user && role === 'vendor') {
      fetchData();
    }
  }, [user, role]);

  const fetchData = async () => {
    try {
      // Fetch vendor details
      const { data: vendorData } = await supabase
        .from('vendors')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (vendorData) {
        setVendor(vendorData);

        // Fetch invoices
        const { data: invoiceData } = await supabase
          .from('invoices')
          .select('*')
          .eq('vendor_id', vendorData.id)
          .order('created_at', { ascending: false })
          .limit(10);

        if (invoiceData) setInvoices(invoiceData);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateInvoice = async () => {
    if (!vendor || !amountInr) return;
    
    setCreating(true);
    try {
      const amount = parseFloat(amountInr);
      const invoiceId = generateInvoiceId();
      const amountBch = inrToBch(amount);
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

      const { data, error } = await supabase
        .from('invoices')
        .insert({
          invoice_id: invoiceId,
          vendor_id: vendor.id,
          amount_inr: amount,
          amount_bch: amountBch,
          note: note || null,
          student_id: studentId || null,
          bch_address: vendor.bch_address,
          expires_at: expiresAt,
        })
        .select()
        .single();

      if (error) throw error;

      const qrData = JSON.stringify({
        invoiceId,
        vendorId: vendor.id,
        vendorName: vendor.shop_name,
        amountBCH: amountBch,
        amountINR: amount,
        bchAddress: vendor.bch_address,
        note: note || undefined,
      });

      setCurrentQrData(qrData);
      setCreateDialogOpen(false);
      setQrDialogOpen(true);
      setAmountInr('');
      setNote('');
      setStudentId('');
      
      fetchData();
      
      toast({
        title: 'Invoice Created',
        description: `Invoice ${invoiceId} is ready for scanning.`,
      });
    } catch (error) {
      console.error('Error creating invoice:', error);
      toast({
        title: 'Error',
        description: 'Failed to create invoice. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setCreating(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  const todayInvoices = invoices.filter(
    i => new Date(i.created_at).toDateString() === new Date().toDateString()
  );
  const todaySales = todayInvoices
    .filter(i => i.status === 'confirmed')
    .reduce((acc, i) => acc + Number(i.amount_inr), 0);
  const pendingCount = invoices.filter(i => i.status === 'pending').length;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-20 pb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Header */}
          <div className="flex items-center justify-between pt-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">{vendor?.shop_name}</h1>
              <p className="text-sm text-muted-foreground capitalize">{vendor?.vendor_type}</p>
            </div>
            
            <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="hero">
                  <Plus size={18} />
                  Create Bill
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Bill</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount (₹)</Label>
                    <Input
                      id="amount"
                      type="number"
                      value={amountInr}
                      onChange={(e) => setAmountInr(e.target.value)}
                      placeholder="Enter amount"
                    />
                    {amountInr && (
                      <p className="text-sm text-muted-foreground">
                        ≈ {inrToBch(parseFloat(amountInr)).toFixed(8)} BCH
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="note">Note (Optional)</Label>
                    <Textarea
                      id="note"
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      placeholder="e.g., Samosa + Tea"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="studentId">Student ID (Optional)</Label>
                    <Input
                      id="studentId"
                      value={studentId}
                      onChange={(e) => setStudentId(e.target.value)}
                      placeholder="STU-2025-001"
                    />
                  </div>
                  <Button 
                    variant="hero" 
                    className="w-full" 
                    onClick={handleCreateInvoice}
                    disabled={!amountInr || creating}
                  >
                    {creating && <Loader2 className="animate-spin" size={18} />}
                    Generate QR Code
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatsCard
              title="Today's Sales"
              value={`₹${todaySales.toFixed(0)}`}
              subtitle={`${todayInvoices.filter(i => i.status === 'confirmed').length} transactions`}
              icon={TrendingUp}
              variant="primary"
            />
            <StatsCard
              title="Total Transactions"
              value={todayInvoices.length}
              subtitle="Today"
              icon={Receipt}
            />
            <StatsCard
              title="Pending"
              value={pendingCount}
              subtitle="Awaiting payment"
              icon={Clock}
            />
          </div>

          {/* Recent Invoices */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Invoices</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {invoices.length === 0 ? (
                <EmptyState
                  icon={Receipt}
                  title="No invoices yet"
                  description="Create your first bill to get started"
                  action={
                    <Button variant="hero" onClick={() => setCreateDialogOpen(true)}>
                      <Plus size={18} />
                      Create Bill
                    </Button>
                  }
                />
              ) : (
                invoices.slice(0, 5).map((invoice) => (
                  <TransactionRow
                    key={invoice.id}
                    type="received"
                    studentName={`Invoice ${invoice.invoice_id}`}
                    amountInr={Number(invoice.amount_inr)}
                    amountBch={Number(invoice.amount_bch)}
                    status={invoice.status}
                    date={invoice.created_at}
                  />
                ))
              )}
            </CardContent>
          </Card>
        </motion.div>
      </main>

      {/* QR Dialog */}
      <Dialog open={qrDialogOpen} onOpenChange={setQrDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-center">Scan to Pay</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center py-6">
            <div className="bg-white p-4 rounded-2xl shadow-lg">
              <QRCodeSVG 
                value={currentQrData} 
                size={240}
                level="H"
              />
            </div>
            {currentQrData && (
              <div className="mt-4 text-center">
                <p className="text-2xl font-bold text-foreground">
                  ₹{JSON.parse(currentQrData).amountINR}
                </p>
                <p className="text-sm text-muted-foreground">
                  {JSON.parse(currentQrData).amountBCH.toFixed(8)} BCH
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  Expires in 10 minutes
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const VendorDashboard = () => {
  return (
    <Routes>
      <Route path="/" element={<VendorHome />} />
      <Route path="/transactions" element={<VendorHome />} />
      <Route path="/analytics" element={<VendorHome />} />
    </Routes>
  );
};

export default VendorDashboard;
