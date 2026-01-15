import { ArrowUpRight, ArrowDownLeft, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { formatDate, maskBchAddress } from '@/lib/constants';

interface TransactionRowProps {
  type: 'sent' | 'received';
  vendorName?: string;
  studentName?: string;
  amountInr: number;
  amountBch: number;
  status: string;
  date: string;
  txHash?: string;
  rewardsEarned?: number;
}

export const TransactionRow = ({
  type,
  vendorName,
  studentName,
  amountInr,
  amountBch,
  status,
  date,
  txHash,
  rewardsEarned,
}: TransactionRowProps) => {
  const statusConfig = {
    pending: { icon: Clock, color: 'text-warning', bg: 'bg-warning/10' },
    confirmed: { icon: CheckCircle2, color: 'text-success', bg: 'bg-success/10' },
    failed: { icon: XCircle, color: 'text-destructive', bg: 'bg-destructive/10' },
  };

  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
  const StatusIcon = config.icon;

  return (
    <div className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border/50 hover:shadow-md transition-all duration-200">
      <div className={`p-3 rounded-full ${type === 'sent' ? 'bg-destructive/10' : 'bg-success/10'}`}>
        {type === 'sent' ? (
          <ArrowUpRight className="text-destructive" size={20} />
        ) : (
          <ArrowDownLeft className="text-success" size={20} />
        )}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="font-semibold text-foreground truncate">
            {type === 'sent' ? vendorName : studentName || 'Student'}
          </p>
          <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.color}`}>
            <StatusIcon size={12} />
            <span className="capitalize">{status}</span>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">{formatDate(date)}</p>
        {txHash && (
          <p className="text-xs text-muted-foreground font-mono mt-1">
            tx: {maskBchAddress(txHash)}
          </p>
        )}
      </div>

      <div className="text-right">
        <p className={`font-bold ${type === 'sent' ? 'text-destructive' : 'text-success'}`}>
          {type === 'sent' ? '-' : '+'}₹{amountInr.toFixed(2)}
        </p>
        <p className="text-xs text-muted-foreground">
          {amountBch.toFixed(8)} BCH
        </p>
        {rewardsEarned !== undefined && rewardsEarned > 0 && (
          <p className="text-xs font-medium text-accent">
            +{rewardsEarned} pts
          </p>
        )}
      </div>
    </div>
  );
};
