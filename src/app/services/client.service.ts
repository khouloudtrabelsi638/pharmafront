import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {map, Observable} from 'rxjs';
import { Client } from '../models/client.model';
import { Debt } from '../models/debt.model';
import { Payment } from '../models/payment.model';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  private baseUrl = 'http://localhost:5365/api/clients';
  private baseUrl2 = 'http://localhost:5365/api/agents';

  constructor(private http: HttpClient) {}

  // ✅ Tous les clients
  getAllClients(): Observable<Client[]> {
    return this.http.get<Client[]>(`${this.baseUrl}`);
  }
// ✅ Clients pour un agent donné
  getClientsByAgent(agentId: number): Observable<Client[]> {
    // Utilise baseUrl2 (qui pointe déjà sur /api/agents)
    return this.http.get<Client[]>(`${this.baseUrl2}/agents/${agentId}/clients`);
  }

  // ✅ Client par ID
  getClientById(id: number): Observable<Client> {
    return this.http.get<Client>(`${this.baseUrl}/${id}`);
  }

  // ✅ Créer un nouveau client
  createClient(client: Client): Observable<Client> {
    return this.http.post<Client>(`${this.baseUrl}`, client);
  }

  // ✅ Mettre à jour un client
  updateClient(id: number, client: Client): Observable<Client> {
    return this.http.put<Client>(`${this.baseUrl}/${id}`, client);
  }

  // ✅ Supprimer un client
  deleteClient(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`, { responseType: 'text' });
  }

  // ✅ Créances/dossiers du client
  getDossiersByClient(clientId: number): Observable<Debt[]> {
    return this.http.get<Debt[]>(`${this.baseUrl}/${clientId}/dossiers`);
  }

  // ✅ Ajouter une créance (dossier) au client
  ajouterDossier(clientId: number, dossier: Debt): Observable<Client> {
    return this.http.post<Client>(`${this.baseUrl}/${clientId}/dossiers`, dossier);
  }

  // ✅ Paiements liés au client
  getPaiementsByClient(clientId: number): Observable<Payment[]> {
    return this.http.get<Payment[]>(`${this.baseUrl}/${clientId}/paiements`);
  }

  // ✅ Recherche avancée par nom / cin / type
  searchClients(nom?: string, cin?: string, type?: string): Observable<Client[]> {
    let params: any = {};
    if (nom) params.nom = nom;
    if (cin) params.cin = cin;
    if (type) params.type = type;
    return this.http.get<Client[]>(`${this.baseUrl}/search`, { params });
  }

  // ✅ Récupérer l'image (base64) du client
  getClientImageBase64(clientId: number): Observable<string> {
    return this.http.get<{ image: string }>(`${this.baseUrl}/${clientId}/image`)
      .pipe(map(resp => resp.image));
  }
}
