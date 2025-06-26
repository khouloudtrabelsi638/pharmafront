  import { Component, OnInit } from '@angular/core';
  import {ActivatedRoute, Router, RouterLink} from '@angular/router';
  import { AgentService } from '../../../services/agent.service';
  import { Agent } from '../../../models/agent.model';
  import { Payment } from '../../../models/payment.model';
  import { MatSnackBar } from '@angular/material/snack-bar';
  import { MatCardModule } from '@angular/material/card';
  import {MatChipsModule } from '@angular/material/chips'; // add this line!

  import { MatTableModule } from '@angular/material/table';
  import { MatListModule } from '@angular/material/list';
  import { MatIconModule } from '@angular/material/icon';
  import { MatButtonModule } from '@angular/material/button';
  import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
  import { MatTooltipModule } from '@angular/material/tooltip';
  import {CommonModule, NgFor, NgIf} from "@angular/common"; // pour matTooltip

  @Component({
    selector: 'app-agent-detail',
    standalone: true,
    imports: [
      CommonModule,
      MatCardModule,
      MatChipsModule,   // <- ici c'est obligatoire
      MatTableModule,
      MatListModule,
      MatIconModule,
      MatButtonModule,
      MatProgressSpinnerModule,
      MatTooltipModule,
      NgIf,
      NgFor,
    ],
    templateUrl: './agent-detail.component.html',
    styleUrls: ['./agent-detail.component.scss']
  })
  export class AgentDetailComponent implements OnInit {
    agent?: Agent;
    paiements: Payment[] = [];
    isLoading = true;
    error?: string;

    constructor(
      private route: ActivatedRoute,
      private router: Router,
      private agentService: AgentService,
      private snackBar: MatSnackBar
    ) {}

    ngOnInit(): void {
      const id = Number(this.route.snapshot.paramMap.get('id'));
      if (!id) {
        this.error = 'Identifiant agent manquant !';
        this.isLoading = false;
        return;
      }
      this.agentService.getAgentById(id).subscribe({
        next: (agent) => {
          this.agent = agent;
          // Charger les paiements collectés par cet agent
          this.agentService.getPaiementsEffectuesParAgent(agent.id).subscribe({
            next: (payments) => {
              this.paiements = payments;
              this.isLoading = false;
            },
            error: () => {
              this.paiements = [];
              this.isLoading = false;
            }
          });
        },
        error: () => {
          this.error = "Agent introuvable ou erreur serveur.";
          this.isLoading = false;
        }
      });
    }
    get hasDossiers(): boolean {
      return Array.isArray(this.agent?.dossierIds) && this.agent!.dossierIds.length > 0;
    }

    editAgent(): void {
      if (this.agent) {
        this.router.navigate(['/agents', this.agent.id, 'edit']);
      }
    }

    backToList(): void {
      this.router.navigate(['/agents']);
    }
  }
