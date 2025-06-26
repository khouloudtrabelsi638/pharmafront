import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DossierRecouvrementService } from 'src/app/services/dossier-recouvrement.service';
import { Debt } from 'src/app/models/debt.model';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { DossierFormModalComponent } from '../dossier-form-modal/dossier-form-modal.component';  // Importer le DossierFormModalComponent
import { ClientService } from 'src/app/services/client.service';

@Component({
  selector: 'app-dossier-list',
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
    MatPaginatorModule,
    MatProgressSpinner,
  ],
  templateUrl: './dossier-list.component.html',
  styleUrls: ['./dossier-list.component.scss']
})
export class DossierListComponent {
  dossierService = inject(DossierRecouvrementService);
  snackBar = inject(MatSnackBar);
  dialog = inject(MatDialog);  // Injecter MatDialog
  clientService = inject(ClientService);

  dossiers: Debt[] = [];
  pagedDossiers: Debt[] = [];
  displayedColumns: string[] = [
    'reference', 'clientId', 'montant', 'dateEcheance', 'statut', 'actions'
  ];
  search: string = '';
  pageIndex = 0;
  pageSize = 10;
  isLoading = false;
  lastAddedDossierId?: number;
  clientsMap: { [id: number]: { prenom: string; nom: string } } = {};

  ngOnInit() {
    // Charge dossiers
    this.loadDossiers();
    // Charge clients et prépare le mapping
    this.clientService.getAllClients().subscribe(clients => {
      this.clientsMap = {};
      clients.forEach(client => {
        if (client.id !== undefined && client.id !== null) {
          this.clientsMap[client.id] = { prenom: client.prenom, nom: client.nom };
        }
      });
    });
  }

  loadDossiers() {
    this.isLoading = true;
    this.dossierService.getAllDossiers().pipe(
      catchError(() => {
        this.snackBar.open('Erreur lors du chargement des dossiers.', '', { duration: 3000 });
        return of([]);
      })
    ).subscribe((dossiers) => {
      this.dossiers = dossiers;
      this.isLoading = false;
      this.updatePagedData();
      if (this.lastAddedDossierId) {
        setTimeout(() => this.lastAddedDossierId = undefined, 2500);
      }
    });

  }
  getClientFullName(clientId: number): string {
    const client = this.clientsMap[clientId];
    if (client) {
      return `${client.prenom} ${client.nom}`;
    }
    return clientId?.toString() || '-';
  }

  updatePagedData() {
    const data = this.filteredDossiers();
    const start = this.pageIndex * this.pageSize;
    this.pagedDossiers = data.slice(start, start + this.pageSize);
  }

  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updatePagedData();
  }

  onSearchChange() {
    this.pageIndex = 0;
    this.updatePagedData();
  }

  filteredDossiers(): Debt[] {
    if (!this.search?.trim()) return this.dossiers;
    const s = this.search.trim().toLowerCase();
    return this.dossiers.filter(d =>
      (d.reference?.toLowerCase().includes(s) || '') ||
      (d.clientId?.toString().includes(s) || '') ||
      (d.statut?.toLowerCase().includes(s) || '')
    );
  }
  isOverdue(dateEcheance: string): boolean {
    return new Date(dateEcheance) < new Date();
  }

  // Fonction pour ouvrir le modal d'édition
  editDossier(dossier: Debt) {
    const dialogRef = this.dialog.open(DossierFormModalComponent, {
      data: { dossier: dossier }, // Passer les données du dossier à éditer
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.action === 'updated') {
        this.loadDossiers();  // Recharge les dossiers après l'édition
      }
    });
  }

  // Fonction pour ouvrir le modal d'ajout
  addDossier() {
    const dialogRef = this.dialog.open(DossierFormModalComponent, {
      data: { dossier: null }, // Aucun dossier à éditer, donc on passe null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.action === 'added') {
        this.loadDossiers();  // Recharge les dossiers après l'ajout
      }
    });
  }

  viewDossier(dossier: Debt) {
    this.snackBar.open(`Voir dossier ${dossier.reference}`, '', { duration: 1000 });
  }

  deleteDossier(dossier: Debt) {
    if (confirm(`Supprimer le dossier ${dossier.reference} ?`)) {
      this.dossierService.deleteDossier(dossier.id).subscribe({
        next: () => {
          this.snackBar.open('Dossier supprimé.', '', { duration: 2000 });
          this.loadDossiers();
        },
        error: () => this.snackBar.open('Erreur lors de la suppression.', '', { duration: 2000 })
      });
    }
  }
  formatReference(ref: string): string {
    // On cherche la partie UUID à la fin du champ
    const uuidMatch = ref.match(/[0-9a-fA-F]{8}-([0-9a-fA-F]{4}-){3}[0-9a-fA-F]{12}/);
    if (!uuidMatch) return ref; // Retourne tel quel si mauvais format

    // Prendre la partie UUID
    const uuid = uuidMatch[0];
    // Découper en blocs
    const blocs = uuid.split('-');
    // Prendre les 2 premiers caractères de chaque bloc
    const result = blocs.map(b => b.slice(0, 2)).join('');
    return `#${result}`;
  }

}
