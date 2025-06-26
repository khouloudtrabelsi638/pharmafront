import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { ClientService } from 'src/app/services/client.service';
import { Client } from 'src/app/models/client.model';
import { TypeClient } from 'src/app/models/enums/type-client.enum';
import {MatIcon} from "@angular/material/icon";
import {MatCard, MatCardContent, MatCardHeader, MatCardTitle} from "@angular/material/card";

@Component({
  selector: 'app-client-form-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatSnackBarModule,
    MatCardContent,
    MatCardTitle,
    MatCardHeader,
    MatCard,
  ],
  templateUrl: './client-form-modal.component.html',
  styleUrls: ['./client-form-modal.component.scss']
})
export class ClientFormModalComponent {
  form: FormGroup;
  isEditMode = false;

  sexeOptions = [
    { value: 'M', label: 'Homme' },
    { value: 'F', label: 'Femme' }
  ];
  typeClientOptions = [
    { value: 'PARTICULIER', label: 'Particulier' },
    { value: 'ENTREPRISE', label: 'Entreprise' },
    { value: 'VIP', label: 'VIP' },
    { value: 'INSTITUTIONNEL', label: 'Institutionnel' },
  ];

  constructor(
    private fb: FormBuilder,
    private clientService: ClientService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<ClientFormModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { client?: Client }
  ) {
    this.isEditMode = !!data.client;
    const c: Partial<Client> = data.client || {};

    // Formulaire différent selon édition/ajout
    this.form = this.fb.group({
      nom: [{ value: c.nom || '', disabled: this.isEditMode }, Validators.required],
      prenom: [{ value: c.prenom || '', disabled: this.isEditMode }, Validators.required],
      email: [c.email || '', [Validators.required, Validators.email]],
      telephone: [c.telephone || '', Validators.required],
      adresse: [c.adresse || ''],
      societe: [c.societe || ''],
      fonction: [c.fonction || ''],
      commentaire: [c.commentaire || ''],
      cin: [{ value: c.cin || '', disabled: this.isEditMode }, Validators.required],
      typeClient: [{ value: c.typeClient || '', disabled: this.isEditMode }, Validators.required],
      dateNaissance: [{ value: c.dateNaissance || '', disabled: this.isEditMode }, Validators.required],
      sexe: [{ value: c.sexe || '', disabled: this.isEditMode }, Validators.required],
      nationalite: [{ value: c.nationalite || 'Tunisienne', disabled: true }],
      dateCreation: [{ value: c.dateCreation || '', disabled: true }],
      age: [{ value: c.age || '', disabled: true }],
      image: [{ value: c.image || '', disabled: true }]
    });

    // En création : forcer nationalité et activer les champs
    if (!this.isEditMode) {
      this.form.get('nationalite')?.setValue('Tunisienne');
      this.form.get('dateCreation')?.disable();
      this.form.get('age')?.disable();
      this.form.get('image')?.disable();
    }
  }

  onSubmit() {
    if (this.form.invalid) return;

    if (!this.isEditMode) {
      const clientToAdd: Client = {
        ...this.form.getRawValue(),
        nationalite: 'Tunisienne',
        dateCreation: new Date().toISOString(),
        age: this.getAge(this.form.get('dateNaissance')?.value)
      };

      this.clientService.createClient(clientToAdd).subscribe({
        next: (client) => {
          this.snackBar.open('Client ajouté', '', { duration: 2000 });
          this.dialogRef.close({ action: 'added', client });
        },
        error: () => this.snackBar.open('Erreur lors de l\'ajout', '', { duration: 2000 })
      });
      return;
    }

    // Édition
    const updateData = {
      ...this.data.client,
      ...this.form.getRawValue()
    };
    this.clientService.updateClient(this.data.client!.id!, updateData).subscribe({
      next: (client) => {
        this.snackBar.open('Client mis à jour', '', { duration: 2000 });
        this.dialogRef.close({ action: 'updated', client });
      },
      error: () => this.snackBar.open('Erreur lors de la mise à jour', '', { duration: 2000 })
    });
  }

  close() {
    this.dialogRef.close();
  }

  // Calcule l'âge
  getAge(dateNaissance: string): number | undefined {
    if (!dateNaissance) return undefined;
    const birth = new Date(dateNaissance);
    const now = new Date();
    let age = now.getFullYear() - birth.getFullYear();
    const m = now.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age--;
    return age;
  }
}
