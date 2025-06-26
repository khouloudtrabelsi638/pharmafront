import { TypeArrangement } from './enums/TypeArrangement';
import { Echeance } from './Echeance';


export interface PaymentPlan {
  id: number;
  typeArrangement: string; // Enum string ("INTEGRAL", "ECHELONNE")
  montantTotal: number;
  nombreEcheances?: number;
  tauxInteret?: number; // % annuel (ex: 7.5)
  datePremiereEcheance?: string; // ISO date string
  echeances?: Echeance[];        // Liste d'échéances simulées
  dossierId: number;
  paiementIds?: number[];
}
