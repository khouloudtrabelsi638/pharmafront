import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs/internal/Observable";
import { Injectable } from "@angular/core";
import { StockDTO } from "../models/StockDTO";
import { PageResponse } from "../models/PageResponse";
import { MouvementStockDTO } from "../models/MouvementStockDTO";

@Injectable({
  providedIn: 'root'
})
export class StockService {
  private readonly baseUrl = 'http://localhost:8071/api/stock';

  constructor(private http: HttpClient) {}

  obtenirStocksEnAlerte(): Observable<StockDTO[]> {
    return this.http.get<StockDTO[]>(`${this.baseUrl}/alertes`);
  }

  obtenirStocksEpuises(): Observable<StockDTO[]> {
    return this.http.get<StockDTO[]>(`${this.baseUrl}/epuises`);
  }

  obtenirHistoriqueMouvements(
    medicamentId: string, 
    page: number = 0, 
    size: number = 20
  ): Observable<PageResponse<MouvementStockDTO>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<PageResponse<MouvementStockDTO>>(
      `${this.baseUrl}/mouvements/${medicamentId}`, 
      { params }
    );
  }

  obtenirMouvementsParPeriode(
    debut: Date, 
    fin: Date
  ): Observable<MouvementStockDTO[]> {
    const params = new HttpParams()
      .set('debut', debut.toISOString())
      .set('fin', fin.toISOString());

    return this.http.get<MouvementStockDTO[]>(
      `${this.baseUrl}/mouvements/periode`, 
      { params }
    );
  }
}