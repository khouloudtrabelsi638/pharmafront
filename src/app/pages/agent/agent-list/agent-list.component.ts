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
import { AgentService } from 'src/app/services/agent.service';
import { Agent } from 'src/app/models/agent.model';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MatPaginatorModule } from '@angular/material/paginator';
import { PageEvent } from '@angular/material/paginator';
import { AgentFormMemoryService } from '../../../services/agent-form-memory-service.service'; // adapte le chemin
import { AffecterDossiersModalComponent } from '../affecter-dossiers-modal/affecter-dossiers-modal.component';

// On suppose que tu as (ou auras) ce modal dans ton dossier agent
import { AgentFormModalComponent } from '../agent-form-modal/agent-form-modal.component';
import {RouterLink} from "@angular/router";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {MatTooltip} from "@angular/material/tooltip";

@Component({
  selector: 'app-agent-list',
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
    AgentFormModalComponent,
    RouterLink,
    MatProgressSpinner,
    MatPaginatorModule,
    MatTooltip,
    // modal agent CRUD (voir remarque)
  ],
  templateUrl: './agent-list.component.html',
  styleUrls: ['./agent-list.component.scss']
})
export class AgentListComponent {
  agentService = inject(AgentService);
  dialog = inject(MatDialog);
  snackBar = inject(MatSnackBar);
  pageIndex = 0;
  pageSize = 5; // par défaut
  pagedData: Agent[] = [];
  lastAddedAgentId?: number | string;
  hoveredRow?: number | string | null = null;

  agents: Agent[] = [];
  displayedColumns: string[] = [
    'code', 'nom', 'prenom', 'email', 'telephone', 'zone', 'actions'
  ];
  search: string = '';
  isLoading = false;
  constructor(
    private memoryService: AgentFormMemoryService,
  ) {}

  ngOnInit() {
    this.loadAgents();
  }

  loadAgents() {
    this.isLoading = true;
    this.agentService.getAllAgents().pipe(
      catchError(() => {
        this.snackBar.open('Erreur lors du chargement des agents.', '', { duration: 3000 });
        return of([]);
      })
    ).subscribe((agents) => {
      this.agents = agents.sort((a, b) => {
        const dateA = a.dateRecrutement ? new Date(a.dateRecrutement).getTime() : 0;
        const dateB = b.dateRecrutement ? new Date(b.dateRecrutement).getTime() : 0;
        return dateB - dateA;
      });
      this.isLoading = false;
      this.updatePagedData();
      // Retirer le highlight après 3s
      if (this.lastAddedAgentId) {
        setTimeout(() => this.lastAddedAgentId = undefined, 3000);
      }
    });
  }
  updatePagedData() {
    const data = this.filteredAgents();
    const startIndex = this.pageIndex * this.pageSize;
    this.pagedData = data.slice(startIndex, startIndex + this.pageSize);
  }
  openAffecterDossiersModal(agent: Agent) {
    const dialogRef = this.dialog.open(AffecterDossiersModalComponent, {
      width: '600px',
      data: { agentId: agent.id }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.success) {
        this.snackBar.open('Dossiers affectés avec succès !', '', { duration: 2000 });
        // Tu peux reload les agents ou leur liste de dossiers ici si besoin
        this.loadAgents();
      }
    });
  }

  // Quand on change de page ou de taille :
  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updatePagedData();
  }


  openAgentForm(agent?: Agent) {
    const dataToSend = agent
      ? { agent }
      : this.memoryService.get() && Object.keys(this.memoryService.get()).length > 0
        ? { agent: this.memoryService.get() }
        : undefined;

    const dialogRef = this.dialog.open(AgentFormModalComponent, {
      width: '480px',
      data: dataToSend,
      autoFocus: false,
      disableClose: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!agent && result?.keepMemory) {
        return;
      }
      this.memoryService.clear();
      if (result?.action === 'saved' || result?.action === 'updated') {
        this.lastAddedAgentId = result.id;
        this.loadAgents();
      }
    });





    dialogRef.afterClosed().subscribe(result => {
      if (result?.action === 'saved') {
        this.lastAddedAgentId = result.id;
        console.log('Agent ajouté, highlight id:', this.lastAddedAgentId);
        this.loadAgents();
      }
    });

  }

  confirmDelete(agent: Agent) {
    if (confirm(`Supprimer l’agent ${agent.nom} ${agent.prenom} ?`)) {
      this.agentService.deleteAgent(agent.id!).subscribe({
        next: () => {
          this.snackBar.open('Agent supprimé.', '', { duration: 2000 });
          this.loadAgents();
        },
        error: () => this.snackBar.open('Erreur lors de la suppression.', '', { duration: 2000 })
      });
    }
  }
  onSearchChange() {
    this.pageIndex = 0; // On revient à la première page
    this.updatePagedData();
  }

  filteredAgents(): Agent[] {
    if (!this.search?.trim()) return this.agents;
    const s = this.search.trim().toLowerCase();
    return this.agents.filter(a =>
      (a.nom?.toLowerCase().includes(s) || '') ||
      (a.prenom?.toLowerCase().includes(s) || '') ||
      (a.code?.toLowerCase().includes(s) || '')
    );
  }

}
