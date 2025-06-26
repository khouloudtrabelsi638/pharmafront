import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Agent } from '../models/agent.model';
import { Debt } from '../models/debt.model'; // = dossier de recouvrement
import { Payment } from '../models/payment.model';

@Injectable({
  providedIn: 'root'
})
export class AgentService {

  private baseUrl = 'http://localhost:5365/api/agents';

  constructor(private http: HttpClient) {}

  // Tous les agents
  getAllAgents(): Observable<Agent[]> {
    return this.http.get<Agent[]>(`${this.baseUrl}`);
  }

  // Un seul agent par ID
  getAgentById(id: number): Observable<Agent> {
    return this.http.get<Agent>(`${this.baseUrl}/${id}`);
  }

  // Créer un agent (si API existe)
  createAgent(agent: Agent): Observable<Agent> {
    return this.http.post<Agent>(`${this.baseUrl}`, agent);
  }

  // Mettre à jour un agent
  updateAgent(id: number, agent: Agent): Observable<Agent> {
    return this.http.put<Agent>(`${this.baseUrl}/${id}`, agent);
  }

  // Supprimer un agent
  deleteAgent(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`, { responseType: 'text' });
  }

  // Affecter des dossiers à un agent
  affecterDossiers(agentId: number, dossierIds: number[]): Observable<Agent> {
    return this.http.post<Agent>(`${this.baseUrl}/${agentId}/dossiers`, dossierIds);
  }

  // Récupérer tous les dossiers (créances) d’un agent
  getDossiersPourAgent(agentId: number): Observable<Debt[]> {
    return this.http.get<Debt[]>(`${this.baseUrl}/${agentId}/dossiers`);
  }

  // Récupérer tous les paiements réalisés via les créances de l’agent
  getPaiementsEffectuesParAgent(agentId: number): Observable<Payment[]> {
    return this.http.get<Payment[]>(`${this.baseUrl}/${agentId}/paiements`);
  }
}
