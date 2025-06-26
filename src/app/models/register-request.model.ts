import { ZoneGeographique } from './enums/zone-geographique.enum';

export interface RegisterRequest {
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  cin: string;
  zone: ZoneGeographique;
  dateRecrutement: string; // format ISO (yyyy-MM-dd)
}
