export interface CategorieDTO {
  id?: string;
  nom: string;
  description?: string;
  categoriePere?: string;
  categorieParenteNom?: string;
  ordre?: number;
  active?: boolean;
}