export interface StockDTO {
  id?: string;
  medicamentId: string;
  nomMedicament?: string;
  quantiteDisponible: number;
  quantiteMinimale: number;
  prixUnitaire: number;
  datePeremption?: Date;
  numeroLot?: string;
  emplacement?: string;
  fournisseur?: string;
  dateCreation?: Date;
  dateModification?: Date;
}