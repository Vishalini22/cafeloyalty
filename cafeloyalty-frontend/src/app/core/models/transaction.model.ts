export interface Transaction {
  id: number;
  customerId: number;
  amount: number;
  pointsEarned: number;
  date: string; // ISO date string from backend
  notes: string | null;
}

export interface CreateTransactionRequest {
  customerId: number;
  amount: number;
  notes?: string;
}

export interface TransactionResponse {
  transactionId: number;
  amount: number;
  pointsEarned: number;
  newPointsBalance: number;
  newLifetimePoints: number;
  tier: string;
  tierChanged: boolean;
}