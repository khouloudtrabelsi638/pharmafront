import { Component, Inject, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Agent } from '../../../models/agent.model';
import { AgentService } from '../../../services/agent.service';
import { ZoneGeographique } from '../../../models/enums/zone-geographique.enum';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import {CommonModule} from "@angular/common";
import { AuthService } from '../../../services/auth.service';
import {AgentFormMemoryService} from "../../../services/agent-form-memory-service.service";
import {MatTooltip} from "@angular/material/tooltip";

@Component({
  selector: 'app-agent-form-modal',
  templateUrl: './agent-form-modal.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatOptionModule,
    MatDialogModule,
    MatIconModule,
    CommonModule,
    MatTooltip,
  ],
  styleUrls: ['./agent-form-modal.component.scss']
})
export class AgentFormModalComponent implements OnInit {
  agentForm!: FormGroup;
  isEditMode: boolean = false;
  isSubmitting: boolean = false;
  errorMsg: string = '';
  zones = Object.values(ZoneGeographique);

  constructor(
    private fb: FormBuilder,
    private memoryService: AgentFormMemoryService,
    private agentService: AgentService,
    private authService: AuthService,
    public dialogRef: MatDialogRef<AgentFormModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data?: { agent?: Agent }
  ) {}

  ngOnInit(): void {
    this.isEditMode = !!this.data?.agent;
    this.agentForm = this.fb.group({
      nom: [this.data?.agent?.nom || '', [Validators.required]],
      prenom: [this.data?.agent?.prenom || '', [Validators.required]],
      email: [this.data?.agent?.email || '', [Validators.required, Validators.email]],
      telephone: [this.data?.agent?.telephone || '', [Validators.required]],
      cin: [this.data?.agent?.cin || '', [Validators.required]],
      zone: [this.data?.agent?.zone || '', [Validators.required]],
    });
    if (!this.isEditMode) {
      this.agentForm.valueChanges.subscribe(val => {
        this.memoryService.set(val);
      });
    }
  }

// À la fermeture, si submit on clear la mémoire, sinon on ne fait rien :


  submitForm() {
    if (this.agentForm.invalid) return;
    this.isSubmitting = true;
    this.errorMsg = '';

    const formValue = this.agentForm.value;
    if (this.isEditMode && this.data?.agent) {
      this.agentService.updateAgent(this.data.agent.id!, { ...this.data.agent, ...formValue }).subscribe({
        next: (updatedAgent) => this.dialogRef.close({ action: 'updated', id: updatedAgent.id }),
        error: (err) => {
          this.errorMsg = err.error?.message || 'Erreur lors de la mise à jour.';
          this.isSubmitting = false;
        }
      });
    } else {
      this.authService.register(formValue).subscribe({
        next: (createdAgent) => {
          this.memoryService.clear();
          this.dialogRef.close({ action: 'saved', id: createdAgent.id });
        },
        error: (err) => {
          this.errorMsg = err.error?.message || 'Erreur lors de la création.';
          this.isSubmitting = false;
        }
      });
    }
  }
  resetForm() {
    this.agentForm.reset(this.isEditMode ? this.data?.agent : {});
  }

  closeModal() {
    this.dialogRef.close();
  }
}
