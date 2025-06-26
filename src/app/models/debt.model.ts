import { DebtStatus } from './enums/debt-status.enum';

export interface Debt {
  id: number;
  montant: number;
  dateEcheance: string; // ISO date string
  statut: DebtStatus; // Enum string (ex : "IMPAYEE", "PAYEE", ...)
  reference: string;
  description?: string;
  clientId: number;
  agence: string;
  typeDossier: string; // Enum string (ex : "IMP", "SDB", "DEBITEUR")
  joursSdbImp?: number;
  totalSdbImp?: number;
  traite?: boolean;
  dateCreation?: string; // ISO date string
}
