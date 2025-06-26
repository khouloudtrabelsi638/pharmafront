import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { TablerIconsModule } from 'angular-tabler-icons';

interface stats {
  id: number;
  color: string;
  title: string;
  subtitle: string;
  img: string;
  percent: string;
}

interface stats2 {
  id: number;
  time: string;
  color: string;
  title?: string;
  subtext?: string;
  link?: string;
}


@Component({
  selector: 'app-upcoming-schedules',
  imports: [MatCardModule, MatChipsModule, TablerIconsModule, MatButtonModule, MatIconModule],
  templateUrl: './upcoming-schedules.component.html',
})
export class AppUpcomingSchedulesComponent {
  constructor() { }

  // Stats traduites en français
  stats: stats[] = [
    {
      id: 1,
      color: 'primary',
      title: 'Paypal',
      subtitle: 'Grandes marques', // "Big Brands" => "Grandes marques"
      img: 'assets/images/svgs/icon-paypal.svg',
      percent: '6235',
    },
    {
      id: 2,
      color: 'success',
      title: 'Portefeuille',
      subtitle: 'Paiement des factures', // "Bill payment" => "Paiement des factures"
      img: 'assets/images/svgs/icon-office-bag.svg',
      percent: '345',
    },
    {
      id: 3,
      color: 'warning',
      title: 'Carte de crédit',
      subtitle: 'Argent reversé', // "Money reversed" => "Argent reversé"
      img: 'assets/images/svgs/icon-master-card.svg',
      percent: '2235',
    },
    {
      id: 4,
      color: 'error',
      title: 'Remboursement',
      subtitle: 'Paiement des factures', // "Bill Payment" => "Paiement des factures"
      img: 'assets/images/svgs/icon-pie.svg',
      percent: '32',
    },
  ];

  // Stats2 traduites en français
  stats2: stats2[] = [
    {
      id: 1,
      time: '09.30 am',
      color: 'primary',
      subtext: 'Paiement reçu de John Doe de $385.90', // "Payment received from John Doe of $385.90" => "Paiement reçu de John Doe de $385.90"
    },
    {
      id: 2,
      time: '10.30 am',
      color: 'accent',
      title: 'Nouvelle vente enregistrée', // "New sale recorded" => "Nouvelle vente enregistrée"
      link: '#ML-3467',
    },
    {
      id: 3,
      time: '12.30 pm',
      color: 'success',
      subtext: 'Paiement de $64.95 effectué à Michael', // "Payment was made of $64.95 to Michael" => "Paiement de $64.95 effectué à Michael"
    },
    {
      id: 4,
      time: '12.30 pm',
      color: 'warning',
      title: 'Nouvelle vente enregistrée', // "New sale recorded" => "Nouvelle vente enregistrée"
      link: '#ML-3467',
    },
    {
      id: 5,
      time: '12.30 pm',
      color: 'error',
      title: 'Nouvelle arrivée enregistrée', // "New arrival recorded" => "Nouvelle arrivée enregistrée"
      link: '#ML-3467',
    },
    {
      id: 6,
      time: '12.30 pm',
      color: 'success',
      subtext: 'Paiement de $64.95 effectué à Michael', // "Payment was made of $64.95 to Michael" => "Paiement de $64.95 effectué à Michael"
    },
  ];
}
