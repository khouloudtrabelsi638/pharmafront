
import { Component, OnInit, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PageEvent } from '@angular/material/paginator';
import { catchError, of, debounceTime, Subject } from 'rxjs';
import { MedicamentFormModalComponent } from '../../medicament-form-modal/medicament-form-modal/medicament-form-modal.component';
import { MedicamentService } from 'src/app/services/medicament.service';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {  MatDialogModule } from '@angular/material/dialog';
import {  MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategorieDTO } from 'src/app/models/CategorieDTO';
import { Observable,  } from 'rxjs';
import { MatPaginatorModule } from '@angular/material/paginator';
import { RouterLink } from "@angular/router";
import { MatProgressSpinner } from "@angular/material/progress-spinner";
import { MatTooltip } from "@angular/material/tooltip";
import { MatChipsModule } from '@angular/material/chips';
import { MatBadgeModule } from '@angular/material/badge';
import { MatSelectModule } from '@angular/material/select';
import { MedicamentResponse } from 'src/app/models/MedicamentResponse';
import { MedicamentFilters } from 'src/app/models/enums/MedicamentFilters';
import { StatutMedicament } from 'src/app/models/enums/StatutMedicament';
import { StockAdjustmentModalComponent } from '../../stock/stock-adjustment-modal-component/stock-adjustment-modal.component';


@Component({
  selector: 'app-medicament-list',
  templateUrl: './medicament-list.component.html',
  styleUrls: ['./medicament-list.component.scss'],
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
      MatProgressSpinner,
      MatPaginatorModule,
      MatTooltip,
      MatChipsModule,
      MatBadgeModule,
    MatSelectModule
    ],
})
export class MedicamentListComponent implements OnInit {
  snackBar = inject(MatSnackBar);

  // Pagination
  pageIndex = 0;
  pageSize = 20;
  totalElements = 0;
  pagedData: MedicamentResponse[] = [];

  // Affichage
  lastAddedMedicamentId?: string;
  hoveredRow?: string | null = null;
  displayedColumns: string[] = [
    'nom', 'principeActif', 'dosageForme', 'laboratoire', 
    'prix', 'stock', 'statut', 'prescription', 'actions'
  ];

  // Données et état
  medicaments: MedicamentResponse[] = [];
  isLoading = false;
  error?: string;

  // Filtres
  filters: MedicamentFilters = {};
  private filterSubject = new Subject<void>();

  constructor(
    private medicamentService: MedicamentService,
    private dialog: MatDialog
  ) {
    // Debounce pour les filtres
    this.filterSubject.pipe(
      debounceTime(500)
    ).subscribe(() => {
      this.loadMedicamentsWithFilters();
    });
  }

  ngOnInit() {
    this.loadMedicaments();
  }

  // Chargement des données
  loadMedicaments() {
    this.isLoading = true;
    this.error = undefined;
    
    this.medicamentService.obtenirMedicamentsAvecPagination(
      this.pageIndex, 
      this.pageSize, 
      'nom', 
      'asc'
    ).pipe(
      catchError((error) => {
        this.snackBar.open('Erreur lors du chargement des médicaments.', '', { duration: 3000 });
        this.isLoading = false;
        this.error = 'Erreur de chargement';
        return of({ content: [], totalElements: 0, number: 0, size: 0 });
      })
    ).subscribe((response) => {
      console.log('API retourne:', response);
      this.pagedData = response.content;
      this.totalElements = response.totalElements;
      this.pageIndex = response.number;
      this.pageSize = response.size;
      this.isLoading = false;
      
      if (this.lastAddedMedicamentId) {
        setTimeout(() => this.lastAddedMedicamentId = undefined, 3000);
      }
    });
  }

  loadMedicamentsWithFilters() {
    if (this.hasActiveFilters()) {
      this.isLoading = true;
      this.error = undefined;
      
      this.medicamentService.rechercherAvecFiltres(
        this.filters.nom,
        this.filters.principeActif,
        this.filters.laboratoire,
        this.filters.statut || undefined,
        this.filters.prixMin,
        this.filters.prixMax,
        this.pageIndex,
        this.pageSize
      ).pipe(
        catchError((error) => {
          this.snackBar.open('Erreur lors de la recherche.', '', { duration: 3000 });
          this.isLoading = false;
          this.error = 'Erreur de recherche';
          return of({ content: [], totalElements: 0, number: 0, size: 0 });
        })
      ).subscribe((response) => {
        this.pagedData = response.content;
        this.totalElements = response.totalElements;
        this.isLoading = false;
      });
    } else {
      this.loadMedicaments();
    }
  }

  // Actions rapides
  loadMedicamentsDisponibles() {
    this.isLoading = true;
    this.medicamentService.obtenirMedicamentsDisponibles().pipe(
      catchError(() => {
        this.snackBar.open('Erreur lors du chargement.', '', { duration: 3000 });
        this.isLoading = false;
        return of([]);
      })
    ).subscribe((medicaments) => {
      this.pagedData = medicaments.slice(0, this.pageSize);
      this.totalElements = medicaments.length;
      this.pageIndex = 0;
      this.isLoading = false;
      this.clearFilters();
    });
  }

  loadMedicamentsEnRupture() {
    this.isLoading = true;
    this.medicamentService.obtenirMedicamentsEnRuptureDeStock().pipe(
      catchError(() => {
        this.snackBar.open('Erreur lors du chargement.', '', { duration: 3000 });
        this.isLoading = false;
        return of([]);
      })
    ).subscribe((medicaments) => {
      this.pagedData = medicaments.slice(0, this.pageSize);
      this.totalElements = medicaments.length;
      this.pageIndex = 0;
      this.isLoading = false;
      this.clearFilters();
    });
  }

  loadMedicamentsEnAlerte() {
    this.isLoading = true;
    this.medicamentService.obtenirMedicamentsEnAlerte().pipe(
      catchError(() => {
        this.snackBar.open('Erreur lors du chargement.', '', { duration: 3000 });
        this.isLoading = false;
        return of([]);
      })
    ).subscribe((medicaments) => {
      this.pagedData = medicaments.slice(0, this.pageSize);
      this.totalElements = medicaments.length;
      this.pageIndex = 0;
      this.isLoading = false;
      this.clearFilters();
    });
  }

  // Gestion des modales
  openMedicamentForm(medicament?: MedicamentResponse) {
    const dialogRef = this.dialog.open(MedicamentFormModalComponent, {
      width: '900px',
      maxWidth: '95vw',
      maxHeight: '90vh',
      data: medicament ? { medicament } : {},
      autoFocus: false,
      disableClose: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.action === 'added' && result.medicament) {
        this.lastAddedMedicamentId = result.medicament?.id;
        this.snackBar.open('Médicament ajouté avec succès !', '', { duration: 2000 });
        this.pageIndex = 0;
        this.loadMedicaments();
      }
      if (result?.action === 'updated') {
        this.snackBar.open('Médicament mis à jour avec succès !', '', { duration: 2000 });
        this.loadMedicaments();
      }
    });
  }

  openEditMedicamentModal(medicament: MedicamentResponse) {
    const dialogRef = this.dialog.open(MedicamentFormModalComponent, {
      width: '900px',
      maxWidth: '95vw',
      maxHeight: '90vh',
      data: { medicament }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.action === 'updated') {
        this.loadMedicaments();
      }
    });
  }

  openStockAdjustment(medicament: MedicamentResponse) {
    const dialogRef = this.dialog.open(StockAdjustmentModalComponent, {
      width: '500px',
      maxWidth: '95vw',
      data: { medicament }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.action === 'adjusted') {
        this.snackBar.open('Stock ajusté avec succès !', '', { duration: 2000 });
        this.loadMedicaments();
      }
    });
  }

  // Actions sur les médicaments
  confirmDelete(medicament: MedicamentResponse) {
    if (confirm(`Supprimer le médicament "${medicament.nom}" ?`)) {
      this.medicamentService.supprimerMedicament(medicament.id!).subscribe({
        next: () => {
          this.snackBar.open('Médicament supprimé.', '', { duration: 2000 });
          this.loadMedicaments();
        },
        error: () => this.snackBar.open('Erreur lors de la suppression.', '', { duration: 2000 })
      });
    }
  }

  toggleStatut(medicament: MedicamentResponse) {
    const nouveauStatut = medicament.statut === StatutMedicament.DISPONIBLE 
      ? StatutMedicament.SUSPENDU 
      : StatutMedicament.DISPONIBLE;
    
    const medicamentModifie = { ...medicament, statut: nouveauStatut };
    
    this.medicamentService.modifierMedicament(medicament.id!, medicamentModifie).subscribe({
      next: () => {
        const action = nouveauStatut === StatutMedicament.DISPONIBLE ? 'réactivé' : 'suspendu';
        this.snackBar.open(`Médicament ${action} avec succès.`, '', { duration: 2000 });
        this.loadMedicaments();
      },
      error: () => this.snackBar.open('Erreur lors de la modification du statut.', '', { duration: 2000 })
    });
  }

  // Gestion des filtres
  onFilterChange() {
    this.pageIndex = 0;
    this.filterSubject.next();
  }

  clearFilters() {
    this.filters = {};
    this.loadMedicaments();
  }

  hasActiveFilters(): boolean {
    return !!(this.filters.nom || this.filters.principeActif || this.filters.laboratoire || 
              this.filters.statut || this.filters.prixMin || this.filters.prixMax);
  }

  // Pagination
  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    if (this.hasActiveFilters()) {
      this.loadMedicamentsWithFilters();
    } else {
      this.loadMedicaments();
    }
  }

  // Utilitaires d'affichage
  getStockColor(medicament: MedicamentResponse): 'primary' | 'accent' | 'warn' {
    if (medicament.stock === 0) return 'warn';
    if (medicament.stock <= medicament.stockAlerte) return 'accent';
    return 'primary';
  }

  getStockIcon(medicament: MedicamentResponse): string {
    if (medicament.stock === 0) return 'remove_circle';
    if (medicament.stock <= medicament.stockAlerte) return 'warning';
    return 'check_circle';
  }

  getStatutColor(statut: StatutMedicament): 'primary' | 'accent' | 'warn' {
    switch (statut) {
      case StatutMedicament.DISPONIBLE: return 'primary';
      case StatutMedicament.RUPTURE_STOCK: return 'warn';
      case StatutMedicament.RETIRE:
      case StatutMedicament.SUSPENDU: return 'accent';
      default: return 'primary';
    }
  }

  getStatutIcon(statut: StatutMedicament): string {
    switch (statut) {
      case StatutMedicament.DISPONIBLE: return 'check_circle';
      case StatutMedicament.RUPTURE_STOCK: return 'error';
      case StatutMedicament.RETIRE: return 'remove_circle';
      case StatutMedicament.SUSPENDU: return 'pause_circle';
      default: return 'help';
    }
  }

  getStatutLabel(statut: StatutMedicament): string {
    switch (statut) {
      case StatutMedicament.DISPONIBLE: return 'Disponible';
      case StatutMedicament.RUPTURE_STOCK: return 'Rupture';
      case StatutMedicament.RETIRE: return 'Retiré';
      case StatutMedicament.SUSPENDU: return 'Suspendu';
      default: return statut;
    }
  }

  displayValue(val: any): string {
    if (val === null || val === undefined || val === '') return '-';
    if (Array.isArray(val) && val.length === 0) return '-';
    return val;
  }
}