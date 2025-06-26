import { NavItem } from './nav-item/nav-item';

export const navItems: NavItem[] = [
   {
      // Choisis la couleur cohérente avec ton thème (primary conseillé)
  },
 {
    displayName: 'Categories',
    iconName: 'layout-grid-add',     // ou 'user-cog', 'users-round' selon la dispo dans ta biblio d’icônes
    route: '/categorie',
    bgcolor: 'primary',    // Choisis la couleur cohérente avec ton thème (primary conseillé)
  },
   {
    displayName: 'Médicament',
    iconName: 'layout-grid-add',     // ou 'user-cog', 'users-round' selon la dispo dans ta biblio d’icônes
    route: '/medicament',
    bgcolor: 'primary',    // Choisis la couleur cohérente avec ton thème (primary conseillé)
  },
    {
    displayName: 'Médicaments',
    iconName: 'layout-grid-add',     // ou 'user-cog', 'users-round' selon la dispo dans ta biblio d’icônes
    route: '/medicaments',
    bgcolor: 'primary',    // Choisis la couleur cohérente avec ton thème (primary conseillé)
  },
  {
    displayName: 'Agents',
    iconName: 'users',     // ou 'user-cog', 'users-round' selon la dispo dans ta biblio d’icônes
    route: '/agents',
    bgcolor: 'primary',    // Choisis la couleur cohérente avec ton thème (primary conseillé)
  },
  {
    displayName: 'Clients',
    iconName: 'users',     // ou 'user-cog', 'users-round' selon la dispo dans ta biblio d’icônes
    route: '/clients',
    bgcolor: 'primary',    // Choisis la couleur cohérente avec ton thème (primary conseillé)
  },
  {
    displayName: 'Dossiers',
    iconName: 'users',     // ou 'user-cog', 'users-round' selon la dispo dans ta biblio d’icônes
    route: '/dossiers',
    bgcolor: 'primary',    // Choisis la couleur cohérente avec ton thème (primary conseillé)
  },
  {
    navCap: 'Page Accueil',
  },
  {
    displayName: 'Tableau de bord',
    iconName: 'layout-grid-add',
    route: '/dashboard',
    bgcolor: 'primary',
  },

  {
    navCap: 'Composants Ui',
  },
  {
    displayName: 'Badge',
    iconName: 'archive',
    route: '/ui-components/badge',
    bgcolor: 'warning',
  },
  {
    displayName: 'Puces',
    iconName: 'info-circle',
    route: '/ui-components/chips',
    bgcolor: 'success',
  },
  {
    displayName: 'Listes',
    iconName: 'list-details',
    route: '/ui-components/lists',
    bgcolor: 'error',
  },
  {
    displayName: 'Menu',
    iconName: 'file-text',
    route: '/ui-components/menu',
    bgcolor: 'primary',
  },
  {
    displayName: 'Info-bulles',
    iconName: 'file-text-ai',
    route: '/ui-components/tooltips',
    bgcolor: 'secondary',
  },
  {
    displayName: 'Formulaires',
    iconName: 'clipboard-text',
    route: '/ui-components/forms',
    bgcolor: 'warning',
  },
  {
    displayName: 'Tableaux',
    iconName: 'table',
    route: '/ui-components/tables',
    bgcolor: 'success',
  },



  {
    navCap: 'Auth',
  },

      {
        displayName: 'Se connecter',
        iconName: 'point',
        bgcolor: 'transparent',
        route: '/authentication/login',
      },



      {
        displayName: 'Inscription',
        iconName: 'point',
        bgcolor: 'transparent',
        route: '/authentication/register',
      },



];
