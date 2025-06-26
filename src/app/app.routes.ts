import { Routes } from '@angular/router';
import { BlankComponent } from './layouts/blank/blank.component';
import { FullComponent } from './layouts/full/full.component';
import { AgentListComponent } from './pages/agent/agent-list/agent-list.component';
import { AgentDetailComponent } from './pages/agent/agent-detail/agent-detail.component';
import {ClientListComponent} from "./pages/client/client-list/client-list.component";
import {DossierListComponent} from "./pages/dossier/dossier-list/dossier-list.component";
import { CategorieListComponent } from './pages/Categorie/categorie-list/categorie-list/categorie-list.component';
import { MedicamentListComponent } from './pages/medicament/medicament-list/medicament-list/medicament-list.component';
import { ConsultMedicamentComponent } from './pages/medicament/consult-medicament/consult-medicament.component';

export const routes: Routes = [
  {
    path: '',
    component: FullComponent,
    children: [
      {
        path: '',
        redirectTo: '/dashboard',
        pathMatch: 'full',
      },
      { path: 'categorie', component: CategorieListComponent },
      { path: 'medicament', component: MedicamentListComponent },
      { path: 'medicaments', component: ConsultMedicamentComponent },

      { path: 'agents', component: AgentListComponent },
      { path: 'clients', component: ClientListComponent },
      { path: 'dossiers', component: DossierListComponent },

      { path: 'agents/:id', component: AgentDetailComponent },

      {
        path: 'dashboard',
        loadChildren: () =>
          import('./pages/pages.routes').then((m) => m.PagesRoutes),
      },
      {
        path: 'ui-components',
        loadChildren: () =>
          import('./pages/ui-components/ui-components.routes').then(
            (m) => m.UiComponentsRoutes
          ),
      },

      {
        path: 'extra',
        loadChildren: () =>
          import('./pages/extra/extra.routes').then((m) => m.ExtraRoutes),
      },
    ],
  },
  {
    path: '',
    component: BlankComponent,
    children: [
      {
        path: 'authentication',
        loadChildren: () =>
          import('./pages/authentication/authentication.routes').then(
            (m) => m.AuthenticationRoutes
          ),
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'authentication/error',
  },
];
