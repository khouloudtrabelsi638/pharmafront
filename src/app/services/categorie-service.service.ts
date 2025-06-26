import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CategorieDTO } from '../models/CategorieDTO';

@Injectable({
  providedIn: 'root'
})
export class CategorieService {
  private readonly baseUrl = 'http://localhost:8071/api/categories';

  constructor(private http: HttpClient) {}

  creerCategorie(categorie: CategorieDTO): Observable<CategorieDTO> {
    return this.http.post<CategorieDTO>(this.baseUrl, categorie);
  }

  obtenirToutesLesCategories(): Observable<CategorieDTO[]> {
    return this.http.get<CategorieDTO[]>(this.baseUrl);
  }

  obtenirCategoriesRacines(): Observable<CategorieDTO[]> {
    return this.http.get<CategorieDTO[]>(`${this.baseUrl}/racines`);
  }

  obtenirSousCategories(id: string): Observable<CategorieDTO[]> {
    return this.http.get<CategorieDTO[]>(`${this.baseUrl}/${id}/sous-categories`);
  }

  modifierCategorie(id: string, categorie: CategorieDTO): Observable<CategorieDTO> {
    return this.http.put<CategorieDTO>(`${this.baseUrl}/${id}`, categorie);
  }

  supprimerCategorie(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}