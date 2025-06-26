import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators ,ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MedicamentResponse } from 'src/app/models/MedicamentResponse';
import { MouvementStockDTO } from 'src/app/models/MouvementStockDTO';
import { MatProgressSpinner } from "@angular/material/progress-spinner";
import { MatTooltip } from "@angular/material/tooltip";
import { MatChipsModule } from '@angular/material/chips';
import { MatBadgeModule } from '@angular/material/badge';
import { MatSelectModule } from '@angular/material/select';
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
export interface StockAdjustmentData {
  medicament: MedicamentResponse;
}

@Component({
  selector: 'app-stock-adjustment-modal',
  templateUrl: './stock-adjustment-modal.component.html',
  styleUrls: ['./stock-adjustment-modal.component.scss'],
    imports: [
        ReactiveFormsModule, 
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
        MatTooltip,
        MatChipsModule,
        MatBadgeModule,
      MatSelectModule
      ],
})
export class StockAdjustmentModalComponent implements OnInit {
  stockForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<StockAdjustmentModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: StockAdjustmentData,
    private medicamentService: MedicamentService,
    private snackBar: MatSnackBar
  ) {
    this.stockForm = this.fb.group({
      typeTransaction: ['', Validators.required],
      quantite: ['', [Validators.required, Validators.min(1)]],
      motif: ['']
    });
  }

  ngOnInit() {
    this.stockForm.get('typeTransaction')?.valueChanges.subscribe(() => {
      this.updateQuantiteValidators();
    });
  }

  updateQuantiteValidators() {
    const quantiteControl = this.stockForm.get('quantite');
    const typeTransaction = this.stockForm.get('typeTransaction')?.value;

    if (quantiteControl) {
      const validators = [Validators.required];
      
      if (typeTransaction === 'SORTIE') {
        validators.push(Validators.min(1));
        validators.push(Validators.max(this.data.medicament.stock));
      } else if (typeTransaction === 'AJUSTEMENT') {
        validators.push(Validators.min(0));
      } else {
        validators.push(Validators.min(1));
      }

      quantiteControl.setValidators(validators);
      quantiteControl.updateValueAndValidity();
    }
  }

  getQuantiteLabel(): string {
    const typeTransaction = this.stockForm.get('typeTransaction')?.value;
    switch (typeTransaction) {
      case 'ENTREE': return 'Quantité à ajouter';
      case 'SORTIE': return 'Quantité à retirer';
      case 'AJUSTEMENT': return 'Nouveau stock';
      default: return 'Quantité';
    }
  }

  getQuantiteHint(): string {
    const typeTransaction = this.stockForm.get('typeTransaction')?.value;
    switch (typeTransaction) {
      case 'ENTREE': return 'Nombre d\'unités à ajouter au stock';
      case 'SORTIE': return `Maximum ${this.data.medicament.stock} unités disponibles`;
      case 'AJUSTEMENT': return 'Valeur absolue du nouveau stock';
      default: return '';
    }
  }

  getMinQuantite(): number {
    const typeTransaction = this.stockForm.get('typeTransaction')?.value;
    return typeTransaction === 'AJUSTEMENT' ? 0 : 1;
  }

  getMaxQuantite(): number {
    const typeTransaction = this.stockForm.get('typeTransaction')?.value;
    return typeTransaction === 'SORTIE' ? this.data.medicament.stock : 9999;
  }

  getMinQuantiteError(): string {
    const typeTransaction = this.stockForm.get('typeTransaction')?.value;
    switch (typeTransaction) {
      case 'SORTIE': return 'Impossible de retirer plus que le stock disponible';
      case 'AJUSTEMENT': return 'Le stock ne peut pas être négatif';
      default: return 'La quantité doit être positive';
    }
  }

  getNouveauStock(): number {
    const quantite = this.stockForm.get('quantite')?.value || 0;
    const typeTransaction = this.stockForm.get('typeTransaction')?.value;
    const stockActuel = this.data.medicament.stock;

    switch (typeTransaction) {
      case 'ENTREE': return stockActuel + quantite;
      case 'SORTIE': return stockActuel - quantite;
      case 'AJUSTEMENT': return quantite;
      default: return stockActuel;
    }
  }

  isStockCritique(): boolean {
    return this.getNouveauStock() <= this.data.medicament.stockAlerte;
  }

  getPreviewCardClass(): string {
    const nouveauStock = this.getNouveauStock();
    if (nouveauStock === 0) return 'preview-danger';
    if (nouveauStock <= this.data.medicament.stockAlerte) return 'preview-warning';
    return 'preview-success';
  }

  getPreviewIcon(): string {
    const nouveauStock = this.getNouveauStock();
    if (nouveauStock === 0) return 'error';
    if (nouveauStock <= this.data.medicament.stockAlerte) return 'warning';
    return 'check_circle';
  }

  getPreviewIconClass(): string {
    const nouveauStock = this.getNouveauStock();
    if (nouveauStock === 0) return 'text-danger';
    if (nouveauStock <= this.data.medicament.stockAlerte) return 'text-warn';
    return 'text-success';
  }

  onSubmit() {
  if (this.stockForm.valid) {
    this.isLoading = true;
    
    const mouvement: MouvementStockDTO = {
      medicamentId: this.data.medicament.id!,
      type: this.stockForm.get('typeTransaction')?.value , // Modification ici
      quantite: this.stockForm.get('quantite')?.value,
      quantiteAvant: this.data.medicament.stock,
      quantiteApres: this.getNouveauStock(),
      motif: this.stockForm.get('motif')?.value || undefined,
      dateTransaction: new Date()
    };

    this.medicamentService.ajusterStock(this.data.medicament.id!, mouvement).subscribe({
      next: () => {
        this.isLoading = false;
        this.dialogRef.close({ action: 'adjusted', mouvement });
      },
      error: (error) => {
        this.isLoading = false;
        this.snackBar.open('Erreur lors de l\'ajustement du stock.', '', { duration: 3000 });
        console.error('Erreur ajustement stock:', error);
      }
    });
  }
}
  onCancel() {
    this.dialogRef.close();
  }
}