import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/layout/Logo';
import { Navbar } from '@/components/layout/Navbar';
import { QrCode, Shield, Zap, Gift, Smartphone, Store, ArrowRight, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
  { icon: QrCode, title: 'QR Payments', description: 'Scan and pay instantly with Bitcoin Cash' },
  { icon: Zap, title: 'Instant Settlement', description: 'Transactions confirmed in seconds' },
  { icon: Shield, title: 'Secure', description: 'End-to-end encrypted transactions' },
  { icon: Gift, title: 'Rewards', description: 'Earn points on every purchase' },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">
        <div className="absolute inset-0 gradient-hero opacity-5" />
        <div className="container mx-auto px-4 relative">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary mb-6">
              <Zap size={16} className="text-accent" />
              <span className="text-sm font-medium text-secondary-foreground">Powered by Bitcoin Cash</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-tight">
              Campus Payments,{' '}
              <span className="text-gradient-primary">Reimagined</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Fast, secure QR-based payments for your college canteen, printing, and events. 
              Earn rewards with every transaction.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth?mode=signup&role=student">
                <Button variant="hero" size="xl" className="w-full sm:w-auto">
                  <Smartphone size={20} />
                  I'm a Student
                  <ArrowRight size={20} />
                </Button>
              </Link>
              <Link to="/auth?mode=signup&role=vendor">
                <Button variant="outline" size="xl" className="w-full sm:w-auto">
                  <Store size={20} />
                  I'm a Vendor
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-muted/50">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Why CampusCash?
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              The complete payment solution designed specifically for campus life
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-card p-6 rounded-2xl border border-border/50 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="text-primary-foreground" size={24} />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Pay in <span className="text-gradient-primary">3 Simple Steps</span>
              </h2>
              
              <div className="space-y-6">
                {[
                  { step: '01', title: 'Scan QR Code', desc: 'Point your camera at the vendor\'s QR code' },
                  { step: '02', title: 'Confirm Payment', desc: 'Review the amount and tap Pay Now' },
                  { step: '03', title: 'Earn Rewards', desc: 'Get points on every transaction' },
                ].map((item) => (
                  <div key={item.step} className="flex gap-4">
                    <div className="w-12 h-12 gradient-accent rounded-xl flex items-center justify-center shrink-0">
                      <span className="text-accent-foreground font-bold">{item.step}</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl p-8 md:p-12">
                <div className="bg-card rounded-2xl shadow-2xl p-6 max-w-xs mx-auto">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 gradient-primary rounded-full flex items-center justify-center">
                      <CheckCircle className="text-primary-foreground" size={20} />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">Payment Successful</p>
                      <p className="text-xs text-muted-foreground">Canteen A</p>
                    </div>
                  </div>
                  <div className="text-center py-4">
                    <p className="text-3xl font-bold text-foreground">₹45.00</p>
                    <p className="text-sm text-muted-foreground">0.001125 BCH</p>
                  </div>
                  <div className="bg-success/10 text-success rounded-lg p-3 text-center">
                    <Gift className="inline mr-2" size={16} />
                    <span className="font-medium">+4 Reward Points Earned!</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 gradient-dark">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-primary-foreground/70 mb-8 max-w-xl mx-auto">
              Join thousands of students and vendors already using CampusCash BCH
            </p>
            <Link to="/auth?mode=signup&role=student">
              <Button variant="accent" size="xl">
                Create Free Account
                <ArrowRight size={20} />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <Logo size="sm" />
            <p className="text-sm text-muted-foreground">
              © 2025 CampusCash BCH. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
