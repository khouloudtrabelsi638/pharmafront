import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CommonModule } from '@angular/common';
import { CategorieDTO } from 'src/app/models/CategorieDTO';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CategorieService } from 'src/app/services/categorie-service.service';

@Component({
  selector: 'app-categorie-form-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatCheckboxModule
  ],
  templateUrl: './categorie-form-modal.component.html',
  styleUrls: ['./categorie-form-modal.component.scss']
})
export class CategorieFormModalComponent implements OnInit {
  form: FormGroup;
  isEditMode = false;
  categories: CategorieDTO[] = [];
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private categorieService: CategorieService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<CategorieFormModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { categorie?: CategorieDTO }
  ) {
    this.form = this.fb.group({
      nom: ['', [Validators.required, Validators.maxLength(100)]],
      description: [''],
      categoriePere: [''],
      ordre: [0, [Validators.min(0)]],
      active: [true]
    });

    if (data?.categorie) {
      this.isEditMode = true;
      this.loadCategorieData(data.categorie);
    }
  }

  ngOnInit() {
    this.loadCategoriesParentes();
  }

  loadCategoriesParentes() {
    this.categorieService.obtenirToutesLesCategories().subscribe({
      next: (categories) => {
        if (this.isEditMode && this.data.categorie) {
          this.categories = categories.filter(c => c.id !== this.data.categorie!.id);
        } else {
          this.categories = categories;
        }
      },
      error: () => {
        this.snackBar.open('Erreur lors du chargement des catégories parentes', '', { duration: 3000 });
      }
    });
  }

  loadCategorieData(categorie: CategorieDTO) {
    this.form.patchValue({
      nom: categorie.nom,
      description: categorie.description || '',
      categoriePere: categorie.categoriePere || '',
      ordre: categorie.ordre || 0,
      active: categorie.active !== false
    });
  }

  onSubmit() {
    if (this.form.valid) {
      this.isLoading = true;
      const formData = this.form.value;
      
      const categorieData: CategorieDTO = {
        nom: formData.nom.trim(),
        description: formData.description?.trim() || undefined,
        categoriePere: formData.categoriePere || undefined,
        ordre: formData.ordre || 0,
        active: formData.active
      };

      if (this.isEditMode && this.data.categorie) {
        this.categorieService.modifierCategorie(this.data.categorie.id!, categorieData).subscribe({
          next: (updatedCategorie) => {
            this.isLoading = false;
            this.dialogRef.close({ action: 'updated', categorie: updatedCategorie });
          },
          error: (error) => {
            this.isLoading = false;
            this.snackBar.open(
              error.error?.message || 'Erreur lors de la modification de la catégorie',
              '',
              { duration: 3000 }
            );
          }
        });
      } else {
        this.categorieService.creerCategorie(categorieData).subscribe({
          next: (newCategorie) => {
            this.isLoading = false;
            this.dialogRef.close({ action: 'added', categorie: newCategorie });
          },
          error: (error) => {
            this.isLoading = false;
            this.snackBar.open(
              error.error?.message || 'Erreur lors de la création de la catégorie',
              '',
              { duration: 3000 }
            );
          }
        });
      }
    }
  }

  close() {
    this.dialogRef.close();
  }

  // Méthode pour obtenir les erreurs de validation
  getErrorMessage(field: string): string {
    const control = this.form.get(field);
    if (control?.hasError('required')) {
      return 'Ce champ est obligatoire';
    }
    if (control?.hasError('maxlength')) {
      return 'Trop de caractères';
    }
    if (control?.hasError('min')) {
      return 'La valeur doit être positive';
    }
    return '';
  }
}