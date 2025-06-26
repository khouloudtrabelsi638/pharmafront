import { Component, Inject, OnInit } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import { DossierRecouvrementService } from 'src/app/services/dossier-recouvrement.service';
import { AgentService } from 'src/app/services/agent.service';
import { Debt } from 'src/app/models/debt.model';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatCardModule} from "@angular/material/card";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {MatSelectModule} from "@angular/material/select";
import {MatOptionModule} from "@angular/material/core";
import {MatIconModule} from "@angular/material/icon";
import {CommonModule} from "@angular/common";
import {
  MatList,
  MatListItem,
  MatListOption,
  MatListSubheaderCssMatStyler,
  MatSelectionList
} from "@angular/material/list";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {MatCell, MatColumnDef, MatHeaderCell, MatHeaderRow, MatRow, MatTable,MatTableModule} from "@angular/material/table";
import {MatCheckbox} from "@angular/material/checkbox";

@Component({
  selector: 'app-affecter-dossiers-modal',
  templateUrl: './affecter-dossiers-modal.component.html',
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
    MatProgressSpinner,
    FormsModule,
    MatCheckbox,
    MatTableModule,
    MatList,
    MatListItem,
    MatListSubheaderCssMatStyler,
  ],
  styleUrls: ['./affecter-dossiers-modal.component.scss']
})
export class AffecterDossiersModalComponent implements OnInit {
  dossiers: Debt[] = [];
  selectedIds: number[] = [];
  isLoading = false;
  errorMsg = '';
  displayedColumns: string[] = ['select', 'montant', 'type'];
  filteredDossiers: Debt[] = [];

  constructor(
    private dossierService: DossierRecouvrementService,
    private agentService: AgentService,
    public dialogRef: MatDialogRef<AffecterDossiersModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { agentId: number }
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.dossierService.getAllDossiers().subscribe({
      next: (dossiers) => {
        this.dossiers = dossiers.filter(d => !d.traite);
        this.filteredDossiers = this.dossiers;
        this.isLoading = false;
      },
      error: () => {
        this.errorMsg = "Erreur lors du chargement des dossiers.";
        this.isLoading = false;
      }
    });
  }
  onInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.applyFilter(input.value);
  }
  applyFilter(value: string) {
    const query = value.trim().toLowerCase();
    this.filteredDossiers = this.dossiers.filter(d =>
      d.typeDossier?.toLowerCase().includes(query) ||
      d.montant?.toString().includes(query)
    );
  }
  getRefBlocs(ref: string): string[] {
    if (!ref) return [];
    return ref.split('-').map(b => b.charAt(0));
  }
  getStyledMiniRef(ref: string): { first: string, rest: string[] } {
    if (!ref) return { first: '', rest: [] };
    const blocs = ref.split('-');
    if (blocs.length < 5) return { first: '#', rest: [] };
    const first = blocs[0].charAt(0).toUpperCase();
    const rest = blocs.slice(1, 5).map(b => b.charAt(0).toUpperCase());
    return { first, rest };
  }

  renderRefMini(ref: string): string {
    if (!ref) return '';
    const blocs = ref.split('-');
    if (blocs.length < 5) return '#' + ref; // fallback
    // 1ère lettre du premier bloc
    const first = blocs[0].charAt(0).toUpperCase();
    // puis les 1ères lettres des 4 blocs suivants, collées
    const rest = blocs.slice(1, 5).map(b => b.charAt(0).toUpperCase()).join('');
    return `#${first}-${rest}`;
  }

  toggleSelection(id: number) {
    const index = this.selectedIds.indexOf(id);
    if (index === -1) this.selectedIds.push(id);
    else this.selectedIds.splice(index, 1);
  }
  isAllSelected(): boolean {
    return !!this.dossiers.length && this.selectedIds.length === this.dossiers.length;
  }
  masterToggle(event: any) {
    if (this.isAllSelected()) this.selectedIds = [];
    else this.selectedIds = this.dossiers.map(d => d.id);
  }
  isLate(date: string): boolean {
    return new Date(date) < new Date();
  }


  submit() {
    if (this.selectedIds.length === 0) return;
    this.isLoading = true;
    this.agentService.affecterDossiers(this.data.agentId, this.selectedIds).subscribe({
      next: () => this.dialogRef.close({ success: true }),
      error: () => {
        this.errorMsg = "Erreur lors de l'affectation.";
        this.isLoading = false;
      }
    });
  }

  cancel() {
    this.dialogRef.close();
  }

  protected readonly HTMLInputElement = HTMLInputElement;
}
