import { Component, inject, Input } from '@angular/core';
import { Question } from '../../../../dashboard/dashboard.dto';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';


@Component({
  selector: 'app-card',
  imports: [CommonModule],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css'
})
export class CardComponent {
  @Input() cardId: string = ''
  @Input() questions: Question[] = []


  private router = inject(Router)
  handleClick(question: Question) {
    this.router.navigate(['chat'], { state: question })
  }
}
