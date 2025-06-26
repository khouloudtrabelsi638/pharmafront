import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PaymentPlan } from '../models/PaymentPlan';

@Injectable({
  providedIn: 'root'
})
export class PaymentPlanService {

  private baseUrl = 'http://localhost:5365/api/payment-plans';

  constructor(private http: HttpClient) { }

  // ✅ Simuler un plan de paiement (renvoie le plan avec échéancier calculé, sans sauvegarde)
  simulatePaymentPlan(plan: PaymentPlan): Observable<PaymentPlan> {
    return this.http.post<PaymentPlan>(`${this.baseUrl}/simulate`, plan);
  }

  // ✅ Créer un plan de paiement (enregistre en base)
  createPaymentPlan(plan: PaymentPlan): Observable<PaymentPlan> {
    return this.http.post<PaymentPlan>(`${this.baseUrl}`, plan);
  }

  // ✅ Récupérer un plan de paiement par ID
  getPaymentPlanById(id: number): Observable<PaymentPlan> {
    return this.http.get<PaymentPlan>(`${this.baseUrl}/${id}`);
  }

  // ✅ Lister tous les plans de paiement
  getAllPaymentPlans(): Observable<PaymentPlan[]> {
    return this.http.get<PaymentPlan[]>(`${this.baseUrl}`);
  }

  // ✅ Supprimer un plan de paiement
  deletePaymentPlan(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
