import { TypeClient } from './enums/type-client.enum';

export interface Client {
  id?: number;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  adresse?: string;
  dateNaissance: string;
  cin: string;
  typeClient: TypeClient;
  societe?: string;
  fonction?: string;
  sexe?: 'M' | 'F';
  nationalite?: string;
  commentaire?: string;
  image?: string; // <- facultatif si base64 est renvoyée directement
  dateCreation?: string;
  age?: number;
  dossierIds?: number[];
}
