import { Component,OnInit } from '@angular/core';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { MedicamentResponse } from 'src/app/models/MedicamentResponse';
import { MedicamentService, PageResponse } from 'src/app/services/medicament.service';
import { StatutMedicament } from 'src/app/models/enums/StatutMedicament';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule,FormsModule } from '@angular/forms';
import { RouterLink } from "@angular/router";
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { MatBadgeModule } from '@angular/material/badge';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
@Component({
  selector: 'app-consult-medicament',
  imports: [    FormsModule,
      ReactiveFormsModule,
      CommonModule,
      RouterLink,
  CommonModule,
  
  FormsModule,
  MatFormFieldModule,
  MatInputModule,
  MatSelectModule,
  MatCardModule,
  MatIconModule,
  MatButtonModule,
  MatTableModule,
  MatPaginatorModule,
  MatProgressSpinnerModule,
  MatChipsModule,
  RouterLink


],
  templateUrl: './consult-medicament.component.html',
  styleUrl: './consult-medicament.component.scss'
})
export class ConsultMedicamentComponent {
  medicaments: MedicamentResponse[] = [];
  pageResponse!: PageResponse<MedicamentResponse>;
  searchForm!: FormGroup;
  statuts = Object.values(StatutMedicament);
  currentPage = 0;
  pageSize = 10;
  isLoading = false;
  sortBy = 'nom';
  sortDir = 'asc';
getPages: any;

  constructor(
    private medicamentService: MedicamentService,
    private fb: FormBuilder
  ) {}
displayedColumns: string[] = ['nom', 'principeActif', 'laboratoire', 'prix', 'stock', 'statut', 'actions'];

getChipColor(statut: StatutMedicament): string {
  switch (statut) {
    case StatutMedicament.DISPONIBLE: return 'primary';
    case StatutMedicament.ALERTE_STOCK: return 'warn';
    case StatutMedicament.RUPTURE_STOCK: return 'accent';
    default: return '';
  }
}

  ngOnInit(): void {
    this.initSearchForm();
    this.loadMedicaments();
  }

  initSearchForm(): void {
    this.searchForm = this.fb.group({
      nom: [''],
      principeActif: [''],
      laboratoire: [''],
      statut: [''],
      prixMin: [''],
      prixMax: ['']
    });

    this.searchForm.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged()
      )
      .subscribe(() => {
        this.currentPage = 0;
        this.loadMedicaments();
      });
  }

  loadMedicaments(): void {
    this.isLoading = true;
    const formValue = this.searchForm.value;

    this.medicamentService.rechercherAvecFiltres(
      formValue.nom,
      formValue.principeActif,
      formValue.laboratoire,
      formValue.statut,
      formValue.prixMin,
      formValue.prixMax,
      this.currentPage,
      this.pageSize
    ).subscribe({
      next: (response) => {
        this.pageResponse = response;
        this.medicaments = response.content;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading medicaments', err);
        this.isLoading = false;
      }
    });
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadMedicaments();
  }

  onSort(sortBy: string): void {
    if (this.sortBy === sortBy) {
      this.sortDir = this.sortDir === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortBy = sortBy;
      this.sortDir = 'asc';
    }
    this.loadMedicaments();
  }

  resetFilters(): void {
    this.searchForm.reset();
    this.currentPage = 0;
    this.sortBy = 'nom';
    this.sortDir = 'asc';
    this.loadMedicaments();
  }

  getStatusClass(statut: StatutMedicament): string {
    switch (statut) {
      case StatutMedicament.DISPONIBLE:
        return 'badge-success';
      case StatutMedicament.RUPTURE_STOCK:
        return 'badge-danger';
      case StatutMedicament.ALERTE_STOCK:
        return 'badge-warning';
      default:
        return 'badge-secondary';
    }
  }
}