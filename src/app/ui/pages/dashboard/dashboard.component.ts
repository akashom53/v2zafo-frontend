import { Component, inject, OnInit } from '@angular/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { CardComponent } from "./card/card.component";
import { DashboardStore } from '../../../dashboard/dashboard.store';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  imports: [
    MatGridListModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    CardComponent
  ]
})
export class DashboardComponent implements OnInit {

  private dashboardStore = inject(DashboardStore);

  cards = this.dashboardStore.cards;
  questionsByCard = this.dashboardStore.questionsByCard;

  ngOnInit(): void {
    this.dashboardStore.fetchQuestions()
  }

}
