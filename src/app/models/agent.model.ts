import { ZoneGeographique } from './enums/zone-geographique.enum';

export interface Agent {
  id: number;
  code: string;
  nom: string;
  prenom: string;
  email: string;
  telephone?: string;
  zone?: string;
  dateRecrutement?: string; // ISO date string
  cin?: string;
  dossierIds?: number[];     // IDs des dossiers affectés (optionnel)
  pwd?: string;
  connecte?: boolean;
  token?: string;
}
