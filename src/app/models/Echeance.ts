export interface Echeance {
  numero: number;
  montant: number;
  dateEcheance: string; // ISO date string
  statut?: string;      // "PAYEE", "EN_COURS", etc.
  paiementId?: number;
}
