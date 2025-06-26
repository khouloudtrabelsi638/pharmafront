import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MaterialModule } from 'src/app/material.module';

// Définition de l'interface pour les données des produits
export interface productsData {
  id: number;
  imagePath: string;
  uname: string;
  position: string;
  hrate: number;
  skills: string;
  priority: string;
  progress: string;
}

// Données des employés avec traduction en français
const ELEMENT_DATA: productsData[] = [
  {
    id: 1,
    imagePath: 'assets/images/profile/user-1.jpg',
    uname: 'Mark J. Freeman',
    position: 'Développeur', // "Developer" => "Développeur"
    skills: 'HTML',
    hrate: 80,
    priority: 'Disponible', // "Available" => "Disponible"
    progress: 'success',
  },
  {
    id: 2,
    imagePath: 'assets/images/profile/user-2.jpg',
    uname: 'Nina R. Oldman',
    position: 'Designer',
    skills: 'JavaScript',
    hrate: 70,
    priority: 'En vacances', // "On Holiday" => "En vacances"
    progress: 'primary',
  },
  {
    id: 3,
    imagePath: 'assets/images/profile/user-3.jpg',
    uname: 'Arya H. Shah',
    position: 'Développeur', // "Developer" => "Développeur"
    skills: 'React',
    hrate: 40,
    priority: 'Absent', // "Absent" => "Absent"
    progress: 'error',
  },
  {
    id: 4,
    imagePath: 'assets/images/profile/user-4.jpg',
    uname: 'June R. Smith',
    position: 'Designer',
    skills: 'Vuejs',
    hrate: 20,
    priority: 'En congé', // "On Leave" => "En congé"
    progress: 'warning',
  },
];

@Component({
  selector: 'app-top-employees',
  standalone: true,
  imports: [CommonModule, MatMenuModule, MatButtonModule, MaterialModule],
  templateUrl: './top-employees.component.html',
})
export class AppTopEmployeesComponent {
  displayedColumns: string[] = ['profile', 'hrate', 'skills', 'status'];
  dataSource = ELEMENT_DATA;
}
