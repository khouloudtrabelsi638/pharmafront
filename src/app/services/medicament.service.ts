import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MedicamentRequest } from '../models/MedicamentRequest';
import { MedicamentResponse } from '../models/MedicamentResponse';
import { StatutMedicament } from '../models/enums/StatutMedicament';
import { MouvementStockDTO } from '../models/MouvementStockDTO';

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
  numberOfElements: number;
}

@Injectable({
  providedIn: 'root'
})
export class MedicamentService {
  
  private readonly API_URL = 'http://localhost:8071/api/medicaments';

  constructor(private http: HttpClient) {}

  // Créer un nouveau médicament
  creerMedicament(medicament: MedicamentRequest): Observable<MedicamentResponse> {
    return this.http.post<MedicamentResponse>(this.API_URL, medicament);
  }
 creerMedicamentAvecImage(formData: FormData): Observable<MedicamentResponse> {
    // Ne pas définir Content-Type, laissez le navigateur le faire automatiquement pour FormData
    return this.http.post<MedicamentResponse>(this.API_URL, formData);
  }
  modifierMedicamentAvecImage(id: string, formData: FormData): Observable<MedicamentResponse> {
    return this.http.put<MedicamentResponse>(`${this.API_URL}/${id}`, formData);
  }

  // Obtenir un médicament par ID
  obtenirMedicamentParId(id: string): Observable<MedicamentResponse> {
    return this.http.get<MedicamentResponse>(`${this.API_URL}/${id}`);
  }

  // Obtenir tous les médicaments avec pagination
  obtenirMedicamentsAvecPagination(
    page: number = 0,
    size: number = 20,
    sortBy: string = 'nom',
    sortDir: string = 'asc'
  ): Observable<PageResponse<MedicamentResponse>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sortBy', sortBy)
      .set('sortDir', sortDir);

    return this.http.get<PageResponse<MedicamentResponse>>(this.API_URL, { params });
  }

  // Modifier un médicament
  modifierMedicament(id: string, medicament: MedicamentResponse): Observable<MedicamentResponse> {
    return this.http.put<MedicamentResponse>(`${this.API_URL}/${id}`, medicament);
  }

  // Supprimer un médicament
  supprimerMedicament(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }

  // Rechercher avec filtres
  rechercherAvecFiltres(
    nom?: string,
    principeActif?: string,
    laboratoire?: string,
    statut?: StatutMedicament,
    prixMin?: number,
    prixMax?: number,
    page: number = 0,
    size: number = 20
  ): Observable<PageResponse<MedicamentResponse>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (nom) params = params.set('nom', nom);
    if (principeActif) params = params.set('principeActif', principeActif);
    if (laboratoire) params = params.set('laboratoire', laboratoire);
    if (statut) params = params.set('statut', statut);
    if (prixMin !== undefined) params = params.set('prixMin', prixMin.toString());
    if (prixMax !== undefined) params = params.set('prixMax', prixMax.toString());

    return this.http.get<PageResponse<MedicamentResponse>>(`${this.API_URL}/recherche`, { params });
  }

  // Rechercher par nom
  rechercherParNom(nom: string): Observable<MedicamentResponse[]> {
    const params = new HttpParams().set('nom', nom);
    return this.http.get<MedicamentResponse[]>(`${this.API_URL}/recherche/nom`, { params });
  }

  // Rechercher par principe actif
  rechercherParPrincipeActif(principeActif: string): Observable<MedicamentResponse[]> {
    const params = new HttpParams().set('principeActif', principeActif);
    return this.http.get<MedicamentResponse[]>(`${this.API_URL}/recherche/principe-actif`, { params });
  }

  // Obtenir les médicaments disponibles
  obtenirMedicamentsDisponibles(): Observable<MedicamentResponse[]> {
    return this.http.get<MedicamentResponse[]>(`${this.API_URL}/disponibles`);
  }

  // Obtenir les médicaments en rupture de stock
  obtenirMedicamentsEnRuptureDeStock(): Observable<MedicamentResponse[]> {
    return this.http.get<MedicamentResponse[]>(`${this.API_URL}/rupture-stock`);
  }

  // Obtenir les médicaments en alerte de stock
  obtenirMedicamentsEnAlerte(): Observable<MedicamentResponse[]> {
    return this.http.get<MedicamentResponse[]>(`${this.API_URL}/alerte-stock`);
  }

  // Ajuster le stock d'un médicament
  ajusterStock(
    id: string, 
    mouvement: MouvementStockDTO, 
    utilisateurId?: string
  ): Observable<void> {
    let headers = new HttpHeaders();
    if (utilisateurId) {
      headers = headers.set('X-User-Id', utilisateurId);
    }

    return this.http.post<void>(`${this.API_URL}/${id}/stock/ajuster`, mouvement, { headers });
  }

  // Utilitaires pour les formulaires
  obtenirFormsMedicament(): Observable<any> {
    // Retourne les différentes formes de médicaments disponibles
    return this.http.get<any>(`${this.API_URL}/formes`);
  }

  obtenirLaboratoires(): Observable<string[]> {
    // Retourne la liste des laboratoires
    return this.http.get<string[]>(`${this.API_URL}/laboratoires`);
  }

  // Vérifier la disponibilité d'un numéro AMM
  verifierNumeroAMM(numeroAMM: string): Observable<boolean> {
    const params = new HttpParams().set('numeroAMM', numeroAMM);
    return this.http.get<boolean>(`${this.API_URL}/verifier-amm`, { params });
  }

  // Obtenir les statistiques des médicaments
  obtenirStatistiques(): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/statistiques`);
  }

  // Exporter les médicaments
  exporterMedicaments(format: 'csv' | 'excel' = 'csv'): Observable<Blob> {
    const params = new HttpParams().set('format', format);
    return this.http.get(`${this.API_URL}/export`, { 
      params, 
      responseType: 'blob' 
    });
  }

  // Importer des médicaments depuis un fichier
  importerMedicaments(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    
    return this.http.post<any>(`${this.API_URL}/import`, formData);
  }

  // Obtenir l'historique des mouvements de stock
  obtenirHistoriqueStock(medicamentId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}/${medicamentId}/stock/historique`);
  }
}