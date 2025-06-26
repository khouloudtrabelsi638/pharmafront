import { FormeMedicament } from "./enums/FormeMedicament";
import { StatutMedicament } from "./enums/StatutMedicament";

export interface MedicamentRequest {
  id: string;
  nom: string;
  nomGenerique?: string;
  principeActif?: string;
  dosage?: string;
  forme?: FormeMedicament;
  laboratoire?: string;
  prix: number;
  prixRemboursement?: number;
  stock: number;
  stockAlerte: number;
  statut: StatutMedicament;
  prescriptionObligatoire: boolean;
  dateExpiration?: Date;
  numeroAMM?: string;
  codeEAN?: string;
  categorieId?: number;
  description?: string;
  posologie?: string;
  contreIndications?: string;
  effetsSecondaires?: string;
  active?: boolean;
  image?:string;
}