export interface Transaction {
  id: string;
  type: "income" | "expense";
  category: string;
  amount: number;
  currency: "BRL" | "USD" | "EUR" | "GBP";
  description: string;
  date: string;
  bankAccount?: string;
  isPending?: boolean;
}

export interface Boleto {
  id: string;
  title: string;
  amount: number;
  currency: "BRL" | "USD" | "EUR" | "GBP";
  dueDate: string;
  paid: boolean;
  category: string;
  barcode: string;
  bank?: string;
}

export interface BankAccount {
  id: string;
  bankName: "Nubank" | "Itaú" | "Inter" | "Santander" | "Banco do Brasil" | "Bradesco" | "Caixa";
  balance: number;
  currency: "BRL" | "USD" | "EUR" | "GBP";
  isConnected: boolean;
  lastSynced?: string;
  accountNumber: string;
  color: string;
}

export interface BackupLog {
  id: string;
  provider: "Google Drive" | "Dropbox" | "EasyFinance Secure Cloud";
  date: string;
  sizeStr: string;
  status: "success" | "warning" | "failed";
}

export interface ExchangeRate {
  code: "BRL" | "USD" | "EUR" | "GBP";
  symbol: string;
  name: string;
  rateToBRL: number; // e.g. 1 USD = 5.42 BRL => USD has rateToBRL = 5.42
}

export interface UserProfile {
  name: string;
  email: string;
  avatarUrl?: string;
  defaultCurrency: "BRL" | "USD" | "EUR" | "GBP";
  isBiometricsActive: boolean;
  isUnlocked: boolean;
  cloudSyncEnabled: boolean;
  lastBackupDate?: string;
  budgetMonthlyLimit: number;
}
