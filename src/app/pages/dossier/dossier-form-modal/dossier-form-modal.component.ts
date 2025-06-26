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
import { DossierRecouvrementService } from 'src/app/services/dossier-recouvrement.service';
import { Debt } from 'src/app/models/debt.model';
import { DebtStatus } from '../../../models/enums/debt-status.enum';
import { AgentService } from 'src/app/services/agent.service';
import { Agent } from 'src/app/models/agent.model';
import {MatCard, MatCardContent, MatCardHeader, MatCardTitle} from "@angular/material/card";

@Component({
  selector: 'app-dossier-form-modal',
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
    MatCard,
    MatCardHeader
  ],
  templateUrl: './dossier-form-modal.component.html',
  styleUrls: ['./dossier-form-modal.component.scss']
})
export class DossierFormModalComponent {
  form: FormGroup;

  isEditMode = false;
  clients: Client[] = [];
  agents: Agent[] = [];
  typeDossierOptions = [
    { value: 'IMP', label: 'IMP' },
    { value: 'SDB', label: 'SDB' },
    { value: 'DEBITEUR', label: 'DEBITEUR' },
  ];

  constructor(
    private fb: FormBuilder,
    private dossierService: DossierRecouvrementService,
    private clientService: ClientService,
    private agentService: AgentService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<DossierFormModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { dossier?: Debt }
  ) {
    this.isEditMode = !!data.dossier;
    const d: Partial<Debt> = data.dossier || {};

    // Charger la liste des clients et agents
    this.clientService.getAllClients().subscribe((clients) => {
      this.clients = clients;
    });

    this.agentService.getAllAgents().subscribe((agents) => {
      this.agents = agents;
    });

    // Formulaire pour ajouter ou éditer un dossier
    this.form = this.fb.group({
      montant: [d.montant || '', [Validators.required, Validators.min(0)]],
      dateEcheance: [d.dateEcheance || '', Validators.required],
      reference: [{ value: d.reference || 'Auto-généré', disabled: true }],
      description: [d.description || ''],
      clientId: [{ value: d.clientId || '', disabled: this.isEditMode }, Validators.required],
      agence: [d.agence || '', Validators.required],
      typeDossier: [{ value: d.typeDossier || '', disabled: this.isEditMode }, Validators.required],
      agentId: [d.id || '', Validators.required],
      statut: [d.statut || DebtStatus.IMPAYEE, Validators.required],
      joursSdbImp: [d.joursSdbImp || 0],
      totalSdbImp: [d.totalSdbImp || 0],
      traite: [d.traite || false],
      dateCreation: [{ value: d.dateCreation || new Date().toISOString().split('T')[0], disabled: true }]
    });

    // 👉 Ajoute ton contrôle dynamique juste après la création du form :
    this.form.get('dateEcheance')?.valueChanges.subscribe(val => {
      const now = new Date();
      if (val) {
        const dateEch = new Date(val);
        let jours = 0;
        if (dateEch < now) {
          const diffTime = Math.abs(now.getTime() - dateEch.getTime());
          jours = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        }
        this.form.patchValue({ joursSdbImp: jours }, { emitEvent: false });
      }
    });
  }
  onSubmit() {
    if (this.form.invalid) return;
    // Règles de transition stricte :
    if (this.isEditMode && !this.canTransitionStatut(this.data.dossier!.statut, this.form.value.statut)) {
      this.snackBar.open('Transition de statut non autorisée.', '', { duration: 2500 });
      return;
    }

    const montant = +this.form.value.montant;

    // Impossible de solder (PAYEE) si montant non nul
    if (this.form.value.statut === DebtStatus.PAYEE && montant > 0) {
      this.snackBar.open('Impossible de solder le dossier sans montant à 0.', '', { duration: 2500 });
      return;
    }

    // Impossible d'annuler sans motif
    if (this.form.value.statut === DebtStatus.ANNULEE && !this.form.value.description?.trim()) {
      this.snackBar.open('Merci d\'indiquer un motif dans la description pour annuler.', '', { duration: 2500 });
      return;
    }

    // Montant négatif interdit
    if (montant < 0) {
      this.snackBar.open('Le montant ne peut pas être négatif.', '', { duration: 2500 });
      return;
    }

    // Montant à zéro interdit sauf si statut PAYEE/ANNULEE
    if (montant === 0 && ![DebtStatus.PAYEE, DebtStatus.ANNULEE].includes(this.form.value.statut)) {
      this.snackBar.open('Montant nul interdit sauf dossier soldé ou annulé.', '', { duration: 2500 });
      return;
    }

    // EN_COURS doit avoir une date d’échéance non passée
    if (this.form.value.statut === DebtStatus.EN_COURS) {
      const dateEch = new Date(this.form.value.dateEcheance);
      if (dateEch < new Date()) {
        this.snackBar.open('La date d\'échéance ne peut pas être passée pour un dossier en cours.', '', { duration: 2500 });
        return;
      }
    }

    // Contrôle métier : statut "PAYEE" sans encaissement interdit
    if (this.form.value.statut === 'PAYEE' && (!this.form.value.montant || +this.form.value.montant > 0)) {
      this.snackBar.open('Impossible de solder le dossier sans montant à 0.', '', { duration: 2500 });
      return;
    }

    // Contrôle métier : "ANNULEE" doit nécessiter une description/justif
    if (this.form.value.statut === 'ANNULEE' && !this.form.value.description?.trim()) {
      this.snackBar.open('Merci d\'indiquer un motif dans la description pour annuler.', '', { duration: 2500 });
      return;
    }

    // Automatisation calcul jours SDB/IMP si dateEcheance remplie
    const now = new Date();
    let joursSdbImp = 0;
    if (this.form.value.dateEcheance) {
      const dateEch = new Date(this.form.value.dateEcheance);
      // Si la date d'échéance est passée, on calcule le nombre de jours
      if (dateEch < now) {
        const diffTime = Math.abs(now.getTime() - dateEch.getTime());
        joursSdbImp = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      }
    }
    this.form.patchValue({ joursSdbImp }); // Mets à jour le champ

    // Rest of your code (pas de changement)
    if (!this.isEditMode) {
      const dossierToAdd: Debt = { ...this.form.getRawValue() }; // getRawValue pour inclure les disabled
      this.dossierService.createDossier(dossierToAdd).subscribe({
        next: () => {
          this.snackBar.open('Dossier ajouté', '', { duration: 2000 });
          this.dialogRef.close({ action: 'added' });
        },
        error: () => this.snackBar.open('Erreur lors de l\'ajout', '', { duration: 2000 })
      });
      return;
    }

    const updateData = {
      ...this.data.dossier,
      ...this.form.getRawValue()
    };
    this.dossierService.updateDossier(this.data.dossier!.id!, updateData).subscribe({
      next: () => {
        this.snackBar.open('Dossier mis à jour', '', { duration: 2000 });
        this.dialogRef.close({ action: 'updated' });
      },
      error: () => this.snackBar.open('Erreur lors de la mise à jour', '', { duration: 2000 })
    });
  }

  close() {
    this.dialogRef.close();
  }
  canTransitionStatut(from: DebtStatus, to: DebtStatus): boolean {
    // EN_COURS -> PAYEE, IMPAYEE, ANNULEE
    // IMPAYEE -> EN_COURS, ANNULEE
    // PAYEE, ANNULEE -> rien (final)
    if (from === to) return true;
    if (from === DebtStatus.EN_COURS && [DebtStatus.PAYEE, DebtStatus.IMPAYEE, DebtStatus.ANNULEE].includes(to)) return true;
    if (from === DebtStatus.IMPAYEE && [DebtStatus.EN_COURS, DebtStatus.ANNULEE].includes(to)) return true;
    return false;
  }

}
