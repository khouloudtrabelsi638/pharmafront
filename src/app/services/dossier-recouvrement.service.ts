import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Debt } from '../models/debt.model';

@Injectable({
  providedIn: 'root'
})
export class DossierRecouvrementService {

  private baseUrl = 'http://localhost:5365/api/dossiers';

  constructor(private http: HttpClient) {}

  // ✅ Créer un dossier de recouvrement
  createDossier(dossier: Debt): Observable<Debt> {
    return this.http.post<Debt>(`${this.baseUrl}`, dossier);
  }

  // ✅ Mettre à jour un dossier
  updateDossier(id: number, dossier: Debt): Observable<Debt> {
    return this.http.put<Debt>(`${this.baseUrl}/${id}`, dossier);
  }

  // ✅ Supprimer un dossier
  deleteDossier(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  // ✅ Récupérer tous les dossiers
  getAllDossiers(): Observable<Debt[]> {
    return this.http.get<Debt[]>(`${this.baseUrl}`);
  }

  // ✅ Récupérer un dossier par ID
  getDossierById(id: number): Observable<Debt> {
    return this.http.get<Debt>(`${this.baseUrl}/${id}`);
  }

  // ✅ Recherche multicritère (POST)
  searchDossiers(criteria: any): Observable<Debt[]> {
    return this.http.post<Debt[]>(`${this.baseUrl}/search`, criteria);
  }

  // ✅ Récupérer les dossiers par statut
  getDossiersByStatus(status: string): Observable<Debt[]> {
    return this.http.get<Debt[]>(`${this.baseUrl}/status/${status}`);
  }

  // ✅ Récupérer les dossiers d’un client
  getDossiersByClient(clientId: number): Observable<Debt[]> {
    return this.http.get<Debt[]>(`${this.baseUrl}/client/${clientId}`);
  }

  // ✅ Dossiers à échéance proche (ex: dans 7 jours)
  getUpcomingDossiers(): Observable<Debt[]> {
    return this.http.get<Debt[]>(`${this.baseUrl}/upcoming`);
  }

  // ✅ Modifier le statut d’un dossier
  updateDossierStatus(id: number, newStatus: string): Observable<Debt> {
    return this.http.put<Debt>(`${this.baseUrl}/${id}/status`, null, {
      params: { newStatus }
    });
  }
}
