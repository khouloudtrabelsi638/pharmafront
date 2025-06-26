import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CategorieService } from 'src/app/services/categorie-service.service';
import { MedicamentService } from 'src/app/services/medicament.service';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategorieDTO } from 'src/app/models/CategorieDTO';
import { Observable } from 'rxjs';
import { MatPaginatorModule } from '@angular/material/paginator';
import { RouterLink } from "@angular/router";
import { MatProgressSpinner } from "@angular/material/progress-spinner";
import { MatTooltip } from "@angular/material/tooltip";
import { MatChipsModule } from '@angular/material/chips';
import { MatBadgeModule } from '@angular/material/badge';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { StatutMedicament } from 'src/app/models/enums/StatutMedicament';
import { FormeMedicament } from 'src/app/models/enums/FormeMedicament';
import { MedicamentDTO } from 'src/app/models/MedicamentDTO';
import { MedicamentRequest } from 'src/app/models/MedicamentRequest';
import { MedicamentResponse } from 'src/app/models/MedicamentResponse';

@Component({
  selector: 'app-medicament-form-modal',
  templateUrl: './medicament-form-modal.component.html',
  styleUrls: ['./medicament-form-modal.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule, 
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatBadgeModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
  ],
})
export class MedicamentFormModalComponent implements OnInit {
  form: FormGroup;
  isEditMode = false;
  categories: CategorieDTO[] = [];
  isLoading = false;
  selectedImage: File | null = null;
  imagePreview: string | null = null;
  
  // Expose enums to template
  statutOptions = Object.values(StatutMedicament);
  formeOptions = Object.values(FormeMedicament);

  constructor(
    private fb: FormBuilder,
    private medicamentService: MedicamentService, 
    private categorieService: CategorieService, 
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<MedicamentFormModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { medicament?: MedicamentDTO }
  ) {
    this.form = this.fb.group({
      nom: ['', [Validators.required, Validators.maxLength(100)]],
      nomGenerique: ['', [Validators.maxLength(100)]],
      principeActif: ['', [Validators.maxLength(200)]],
      dosage: ['', [Validators.maxLength(50)]],
      forme: [null],
      laboratoire: ['', [Validators.maxLength(100)]],
      prix: [0, [Validators.required, Validators.min(0)]],
      prixRemboursement: [0, [Validators.min(0)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      stockAlerte: [5, [Validators.required, Validators.min(0)]],
      statut: [StatutMedicament.DISPONIBLE, [Validators.required]],
      prescriptionObligatoire: [false],
      dateExpiration: [null],
      numeroAMM: ['', [Validators.maxLength(50)]],
      codeEAN: ['', [Validators.maxLength(13)]],
      categorieId: [null],
      description: ['', [Validators.maxLength(1000)]],
      posologie: ['', [Validators.maxLength(500)]],
      contreIndications: ['', [Validators.maxLength(500)]],
      effetsSecondaires: ['', [Validators.maxLength(500)]],
      active: [true],
    });

    if (data?.medicament) {
      this.isEditMode = true;
      this.loadMedicamentData(data.medicament);
    }
  }

  ngOnInit() {
    this.loadCategories();
  }

  // Method to trigger file input click
  triggerFileInput(): void {
    const fileInput = document.getElementById('image') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }

  onImageSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      // Validation du type de fichier
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        this.snackBar.open('Type de fichier non supporté. Utilisez JPG, PNG ou GIF.', '', { duration: 3000 });
        return;
      }

      // Validation de la taille (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        this.snackBar.open('Le fichier est trop volumineux. Taille maximum: 5MB.', '', { duration: 3000 });
        return;
      }

      this.selectedImage = file;

      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  loadCategories() {
    this.categorieService.obtenirToutesLesCategories().subscribe({
      next: (categories: CategorieDTO[]) => {
        this.categories = categories;
      },
      error: () => {
        this.snackBar.open('Erreur lors du chargement des catégories', '', { duration: 3000 });
      }
    });
  }

  loadMedicamentData(medicament: MedicamentDTO) {
    this.form.patchValue({
      nom: medicament.nom,
      nomGenerique: medicament.nomGenerique || '',
      principeActif: medicament.principeActif || '',
      dosage: medicament.dosage || '',
      forme: medicament.forme || null,
      laboratoire: medicament.laboratoire || '',
      prix: medicament.prix,
      prixRemboursement: medicament.prixRemboursement || 0,
      stock: medicament.stock,
      stockAlerte: medicament.stockAlerte,
      statut: medicament.statut,
      prescriptionObligatoire: medicament.prescriptionObligatoire,
      dateExpiration: medicament.dateExpiration || null,
      numeroAMM: medicament.numeroAMM || '',
      codeEAN: medicament.codeEAN || '',
      categorieId: medicament.categorieId || null,
      description: medicament.description || '',
      posologie: medicament.posologie || '',
      contreIndications: medicament.contreIndications || '',
      effetsSecondaires: medicament.effetsSecondaires || '',
      active: medicament.active !== false,
    });

    // Charger l'image existante si disponible
    if (medicament.image) {
      this.imagePreview = `uploads/medicaments/${medicament.image}`;
    }
  }

  onSubmit() {
    if (this.form.valid) {
      this.isLoading = true;
      const rawFormValue = this.form.value;
      
      const medicamentData: MedicamentRequest = {
        nom: rawFormValue.nom.trim(),
        nomGenerique: rawFormValue.nomGenerique?.trim() || undefined,
        principeActif: rawFormValue.principeActif?.trim() || undefined,
        dosage: rawFormValue.dosage?.trim() || undefined,
        forme: rawFormValue.forme || undefined,
        laboratoire: rawFormValue.laboratoire?.trim() || undefined,
        prix: parseFloat(rawFormValue.prix),
        prixRemboursement: rawFormValue.prixRemboursement ? parseFloat(rawFormValue.prixRemboursement) : undefined,
        stock: parseInt(rawFormValue.stock),
        stockAlerte: parseInt(rawFormValue.stockAlerte),
        statut: rawFormValue.statut,
        prescriptionObligatoire: rawFormValue.prescriptionObligatoire,
        dateExpiration: rawFormValue.dateExpiration || undefined,
        numeroAMM: rawFormValue.numeroAMM?.trim() || undefined,
        codeEAN: rawFormValue.codeEAN?.trim() || undefined,
        categorieId: rawFormValue.categorieId || undefined,
        description: rawFormValue.description?.trim() || undefined,
        posologie: rawFormValue.posologie?.trim() || undefined,
        contreIndications: rawFormValue.contreIndications?.trim() || undefined,
        effetsSecondaires: rawFormValue.effetsSecondaires?.trim() || undefined,
        active: rawFormValue.active,
        id: ''
      };

      // Préparer FormData pour l'envoi avec image
      const formData = new FormData();
      formData.append('medicament', new Blob([JSON.stringify(medicamentData)], { type: 'application/json' }));
      
      if (this.selectedImage) {
        formData.append('imageFile', this.selectedImage);
      }

      if (this.isEditMode && this.data.medicament) {
        // Pour la modification, utiliser FormData si une nouvelle image est sélectionnée
        if (this.selectedImage) {
          this.medicamentService.modifierMedicamentAvecImage(this.data.medicament.id!, formData).subscribe({
            next: (updatedMedicament: MedicamentResponse) => {
              this.isLoading = false;
              this.snackBar.open('Médicament modifié avec succès', '', { duration: 3000 });
              this.dialogRef.close({ action: 'updated', medicament: updatedMedicament });
            },
            error: (error: any) => {
              this.isLoading = false;
              this.snackBar.open(
                error.error?.message || 'Erreur lors de la modification du médicament',
                '',
                { duration: 3000 }
              );
            }
          });
        } else {
          // Modification sans nouvelle image
          this.medicamentService.modifierMedicament(this.data.medicament.id!, medicamentData).subscribe({
            next: (updatedMedicament: MedicamentResponse) => {
              this.isLoading = false;
              this.snackBar.open('Médicament modifié avec succès', '', { duration: 3000 });
              this.dialogRef.close({ action: 'updated', medicament: updatedMedicament });
            },
            error: (error: any) => {
              this.isLoading = false;
              this.snackBar.open(
                error.error?.message || 'Erreur lors de la modification du médicament',
                '',
                { duration: 3000 }
              );
            }
          });
        }
      } else {
        // Création - utiliser FormData
        this.medicamentService.creerMedicamentAvecImage(formData).subscribe({
          next: (newMedicament: MedicamentResponse) => {
            this.isLoading = false;
            this.snackBar.open('Médicament ajouté avec succès', '', { duration: 3000 });
            this.dialogRef.close({ action: 'added', medicament: newMedicament });
          },
          error: (error: any) => {
            this.isLoading = false;
            this.snackBar.open(
              error.error?.message || 'Erreur lors de la création du médicament',
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

  // Helper method for template to get form control
  getFormControl(field: string) {
    return this.form.get(field);
  }

  // Méthode pour supprimer l'image sélectionnée
  removeImage() {
    this.selectedImage = null;
    this.imagePreview = null;
    // Reset file input
    const fileInput = document.getElementById('image') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }
}