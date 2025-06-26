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
import { CategorieDTO } from 'src/app/models/CategorieDTO';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MatPaginatorModule } from '@angular/material/paginator';
import { PageEvent } from '@angular/material/paginator';
import { RouterLink } from "@angular/router";
import { MatProgressSpinner } from "@angular/material/progress-spinner";
import { MatTooltip } from "@angular/material/tooltip";
import { MatChipsModule } from '@angular/material/chips';
import { MatBadgeModule } from '@angular/material/badge';
import { CategorieService } from 'src/app/services/categorie-service.service';
import { CategorieFormModalComponent } from '../../categorie-form-modal/categorie-form-modal/categorie-form-modal.component';

@Component({
  selector: 'app-categorie-list',
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
    MatProgressSpinner,
    MatPaginatorModule,
    MatTooltip,
    MatChipsModule,
    MatBadgeModule,
  ],
  templateUrl: './categorie-list.component.html',
  styleUrls: ['./categorie-list.component.scss'],
})
export class CategorieListComponent {
  snackBar = inject(MatSnackBar);

  pageIndex = 0;
  pageSize = 10;
  pagedData: CategorieDTO[] = [];
  lastAddedCategorieId?: string;
  hoveredRow?: string | null = null;

  categories: CategorieDTO[] = [];
  displayedColumns: string[] = [
    'nom', 'description', 'categorieParenteNom', 'ordre', 'active', 'actions'
  ];
  search: string = '';
  isLoading = false;
  error?: string;

  constructor(
    private categorieService: CategorieService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.loadCategories();
  }

  openEditCategorieModal(categorie: CategorieDTO) {
    const dialogRef = this.dialog.open(CategorieFormModalComponent, {
      width: '700px',
      maxWidth: '95vw',
      data: { categorie }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.action === 'updated') {
        this.loadCategories();
      }
    });
  }

  loadCategories() {
    this.isLoading = true;
    this.error = undefined;
    
    this.categorieService.obtenirToutesLesCategories().pipe(
      catchError(() => {
        this.snackBar.open('Erreur lors du chargement des catégories.', '', { duration: 3000 });
        this.isLoading = false;
        return of([]);
      })
    ).subscribe((categories) => {
      console.log('API retourne:', categories);
      this.categories = categories;
      this.isLoading = false;
      this.updatePagedData();
      if (this.lastAddedCategorieId) {
        setTimeout(() => this.lastAddedCategorieId = undefined, 3000);
      }
    });
  }

  updatePagedData() {
    const data = this.filteredCategories();
    const startIndex = this.pageIndex * this.pageSize;
    this.pagedData = data.slice(startIndex, startIndex + this.pageSize);
  }

  openCategorieForm(categorie?: CategorieDTO) {
    const dialogRef = this.dialog.open(CategorieFormModalComponent, {
      width: '700px',
      maxWidth: '95vw',
      data: categorie ? { categorie } : {},
      autoFocus: false,
      disableClose: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.action === 'added' && result.categorie) {
        this.lastAddedCategorieId = result.categorie?.id;
        this.snackBar.open('Catégorie ajoutée avec succès !', '', { duration: 2000 });
        this.pageIndex = 0;
        this.updatePagedData();
        this.categories.unshift(result.categorie);
        this.loadCategories();
      }
      if (result?.action === 'updated') {
        this.snackBar.open('Catégorie mise à jour avec succès !', '', { duration: 2000 });
        this.loadCategories();
      }
    });
  }

  confirmDelete(categorie: CategorieDTO) {
    if (confirm(`Supprimer la catégorie "${categorie.nom}" ?`)) {
      this.categorieService.supprimerCategorie(categorie.id!).subscribe({
        next: () => {
          this.snackBar.open('Catégorie supprimée.', '', { duration: 2000 });
          this.loadCategories();
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

  filteredCategories(): CategorieDTO[] {
    if (!this.search?.trim()) return this.categories;
    const s = this.search.trim().toLowerCase();
    return this.categories.filter(c =>
      (c.nom?.toLowerCase().includes(s) || '') ||
      (c.description?.toLowerCase().includes(s) || '') ||
      (c.categorieParenteNom?.toLowerCase().includes(s) || '')
    );
  }

  displayValue(val: any): string {
    if (val === null || val === undefined || val === '') return '-';
    if (Array.isArray(val) && val.length === 0) return '-';
    return val;
  }

  loadSousCategories(categorieId: string) {
    this.categorieService.obtenirSousCategories(categorieId).subscribe({
      next: (sousCategories) => {
        console.log('Sous-catégories:', sousCategories);
        // Ici vous pouvez afficher les sous-catégories dans un modal ou une section expandable
      },
      error: () => this.snackBar.open('Erreur lors du chargement des sous-catégories.', '', { duration: 2000 })
    });
  }
}