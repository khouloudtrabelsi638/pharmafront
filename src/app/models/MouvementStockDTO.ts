export interface MouvementStockDTO {
  id?: string;
  medicamentId: string;
  nomMedicament?: string;
  type: 'ENTREE' | 'SORTIE' | 'AJUSTEMENT' | 'PEREMPTION'; // Modifié pour correspondre à l'enum Java
  quantite: number;
  quantiteAvant?: number;
  quantiteApres?: number;
  motif?: string;
  reference?: string;
  utilisateur?: string;
  dateTransaction?: Date;
  commentaire?: string;
}