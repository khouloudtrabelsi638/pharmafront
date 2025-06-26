import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClientService } from 'src/app/services/client.service';
import { Client } from 'src/app/models/client.model';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MatPaginatorModule } from '@angular/material/paginator';
import { PageEvent } from '@angular/material/paginator';
import { RouterLink } from "@angular/router";
import { MatProgressSpinner } from "@angular/material/progress-spinner";
import { MatTooltip } from "@angular/material/tooltip";
import { ClientFormModalComponent } from '../client-form-modal/client-form-modal.component'; // adapte le chemin

@Component({
  selector: 'app-client-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    RouterLink,
    MatProgressSpinner,
    MatPaginatorModule,
    MatTooltip,
  ],
  templateUrl: './client-list.component.html',
  styleUrls: ['./client-list.component.scss'],
})
export class ClientListComponent {
  snackBar = inject(MatSnackBar);

  pageIndex = 0;
  pageSize = 5;
  pagedData: Client[] = [];
  lastAddedClientId?: number | string;
  hoveredRow?: number | string | null = null;

  clients: Client[] = [];
  displayedColumns: string[] = [
    'nom', 'prenom', 'email', 'telephone', 'adresse', 'dateNaissance', 'cin',
    'typeClient', 'societe', 'fonction', 'sexe', 'nationalite', 'commentaire', 'dateCreation', 'age', 'actions'
  ];
  search: string = '';
  isLoading = false;
  error?: string;
  constructor(
    private clientService: ClientService,
    private dialog: MatDialog
  ) {}


  ngOnInit() {
    this.loadClients();
  }
  openEditClientModal(client: Client) {
    const dialogRef = this.dialog.open(ClientFormModalComponent, {
      width: '900px', // Correct pour deux colonnes
      maxWidth: '95vw',
      data: { client }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.action === 'updated') {
        this.loadClients(); // Refresh la liste après maj
      }
    });
  }

  loadClients() {
    this.isLoading = true;
    this.error = undefined;
    const agentId = sessionStorage.getItem('id');
    if (!agentId) {
      this.error = "Identifiant agent manquant (session expirée ?)";
      this.isLoading = false;
      return;
    }
    this.clientService.getClientsByAgent(Number(agentId)).pipe(
      catchError(() => {
        this.snackBar.open('Erreur lors du chargement des clients.', '', { duration: 3000 });
        this.isLoading = false;
        return of([]);
      })
    ).subscribe((clients) => {
      console.log('API retourne:', clients); // <---- AJOUTE CETTE LIGNE
      this.clients = clients;
      this.isLoading = false;
      this.updatePagedData();
      if (this.lastAddedClientId) {
        setTimeout(() => this.lastAddedClientId = undefined, 3000);
      }
    });
  }

  updatePagedData() {
    const data = this.filteredClients();
    const startIndex = this.pageIndex * this.pageSize;
    this.pagedData = data.slice(startIndex, startIndex + this.pageSize);
  }

  // À adapter si tu ajoutes/modifies des clients via un modal
  openClientForm(client?: Client) {
    const dialogRef = this.dialog.open(ClientFormModalComponent, {
      width: '1000px',
      maxWidth: '95vw',
      data: client ? { client } : {},
      autoFocus: false,
      disableClose: false
    });


    dialogRef.afterClosed().subscribe(result => {
      if (result?.action === 'added' && result.client) {
        this.lastAddedClientId = result.client?.id;
        this.snackBar.open('Client ajouté avec succès !', '', { duration: 2000 });
        // Forcer le retour à la première page (pour voir le nouveau client)
        this.pageIndex = 0;
        this.updatePagedData();             // Mets à jour la pagination
        this.clients.unshift(result.client); // Ajoute au début de la liste

        this.loadClients();
      }
      if (result?.action === 'updated') {
        this.snackBar.open('Client mis à jour avec succès !', '', { duration: 2000 });
        this.loadClients();
      }
    });
  }

  confirmDelete(client: Client) {
    if (confirm(`Supprimer le client ${client.nom} ${client.prenom} ?`)) {
      this.clientService.deleteClient(client.id!).subscribe({
        next: () => {
          this.snackBar.open('Client supprimé.', '', { duration: 2000 });
          this.loadClients();
        },
        error: () => this.snackBar.open('Erreur lors de la suppression.', '', { duration: 2000 })
      });
    }
  }
  onSearchChange() {
    this.pageIndex = 0;
    this.updatePagedData();
  }
  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updatePagedData();
  }
  filteredClients(): Client[] {
    if (!this.search?.trim()) return this.clients;
    const s = this.search.trim().toLowerCase();
    return this.clients.filter(c =>
      (c.nom?.toLowerCase().includes(s) || '') ||
      (c.prenom?.toLowerCase().includes(s) || '') ||
      (c.cin?.toLowerCase().includes(s) || '') ||
      (c.email?.toLowerCase().includes(s) || '')
    );
  }
  displayValue(val: any): string {
    // Affiche '-' si null/undefined/chaîne vide
    if (val === null || val === undefined || val === '') return '-';
    if (Array.isArray(val) && val.length === 0) return '-';
    return val;
  }
}
