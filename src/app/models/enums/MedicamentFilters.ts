import { StatutMedicament } from "./StatutMedicament";

export interface MedicamentFilters {
  nom?: string;
  principeActif?: string;
  laboratoire?: string;
  statut?: StatutMedicament | '';
  prixMin?: number;
  prixMax?: number;
}