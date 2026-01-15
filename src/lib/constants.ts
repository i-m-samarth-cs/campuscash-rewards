// BCH conversion rate (demo value)
export const BCH_TO_INR_RATE = 40000;

// Calculate BCH amount from INR
export const inrToBch = (inrAmount: number): number => {
  return Number((inrAmount / BCH_TO_INR_RATE).toFixed(8));
};

// Calculate INR amount from BCH
export const bchToInr = (bchAmount: number): number => {
  return Number((bchAmount * BCH_TO_INR_RATE).toFixed(2));
};

// Calculate reward points (1 point per ₹10)
export const calculateRewardPoints = (inrAmount: number): number => {
  return Math.floor(inrAmount / 10);
};

// Generate invoice ID
export const generateInvoiceId = (): string => {
  return `INV-${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
};

// Generate redemption code
export const generateRedemptionCode = (): string => {
  return `RDM-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
};

// Generate fake transaction hash
export const generateTxHash = (): string => {
  const chars = '0123456789abcdef';
  let hash = '';
  for (let i = 0; i < 64; i++) {
    hash += chars[Math.floor(Math.random() * chars.length)];
  }
  return hash;
};

// Format BCH address for display (masked)
export const maskBchAddress = (address: string): string => {
  if (address.length <= 20) return address;
  return `${address.substring(0, 15)}...${address.substring(address.length - 8)}`;
};

// Format date
export const formatDate = (date: string | Date): string => {
  return new Date(date).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Vendor types
export const VENDOR_TYPES = [
  { value: 'canteen', label: 'Canteen' },
  { value: 'printing', label: 'Printing' },
  { value: 'stationery', label: 'Stationery' },
  { value: 'events', label: 'Events' },
] as const;
