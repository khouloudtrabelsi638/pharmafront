import { MoyenPaiement } from './enums/moyen-paiement.enum';

export interface Payment {
  id: number;
  montant: number;
  datePaiement: string; // ISO date string
  moyenPaiement?: string;
  referenceTransaction: string;
  creanceId: number; // dossierId (backend : payment.creance.id)
}
