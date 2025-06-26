import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Payment } from '../models/payment.model';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  private baseUrl = 'http://localhost:5365/api/payments';

  constructor(private http: HttpClient) {}

  // ✅ GET: Tous les paiements
  getAllPayments(): Observable<Payment[]> {
    return this.http.get<Payment[]>(`${this.baseUrl}`);
  }

  // ✅ GET: Paiement par ID
  getPaymentById(id: number): Observable<Payment> {
    return this.http.get<Payment>(`${this.baseUrl}/${id}`);
  }

  // ✅ POST: Création d’un paiement
  createPayment(payment: Payment): Observable<Payment> {
    return this.http.post<Payment>(`${this.baseUrl}`, payment);
  }

  // ✅ DELETE: Suppression d’un paiement
  deletePayment(id: number): Observable<string> {
    return this.http.delete<string>(`${this.baseUrl}/${id}`);
  }

  // ✅ GET: Paiements d’un dossier
  getPaymentsByDossier(dossierId: number): Observable<Payment[]> {
    return this.http.get<Payment[]>(`${this.baseUrl}/dossier/${dossierId}`);
  }

  // ✅ GET: Paiements d’un client
  getPaymentsByClient(clientId: number): Observable<Payment[]> {
    return this.http.get<Payment[]>(`${this.baseUrl}/client/${clientId}`);
  }

  // ✅ GET: Total payé pour un dossier
  getTotalPaidForDossier(dossierId: number): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/dossier/${dossierId}/total`);
  }

  // ✅ GET: Paiements entre deux dates
  getPaymentsBetween(start: string, end: string): Observable<Payment[]> {
    return this.http.get<Payment[]>(`${this.baseUrl}/filter`, {
      params: { start, end }
    });
  }
}
