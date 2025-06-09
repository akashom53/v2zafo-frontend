import { Location, NgFor, NgIf } from '@angular/common';
import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MarkdownModule } from 'ngx-markdown';
import { Store } from '@ngrx/store';
import { selectIsAuthenticated } from '../../../auth/state/auth.selectors';
import { catchError, concatMap, EMPTY, finalize, from, interval, map, Observable, share, Subject, take, takeUntil, tap, timer } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ChatResponse, ChatService } from '../../../chat/chat.service';
import { BarChartComponent } from "../charts/bar.chart/bar.chart.component";
import {
  trigger,
  transition,
  style,
  animate
} from '@angular/animations';
import { DashboardStore } from '../../../dashboard/dashboard.store';
import { MatDialog } from '@angular/material/dialog';
import { PinDialogComponent } from './pindialog.component';
import { Router } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';

const TEMP = `
### Summary of Weekly Search Results Page Visits\n\n- **Overall Trend**: Over the last two months, there is a noticeable fluctuation in the number of weekly visits to the search results page, with a general upward trend followed by a decline towards the end of the period.\n\n- **Initial Increase**: \n  - The visits started at 15 in the week of February 24, 2025.\n  - There was a significant increase in the following weeks, peaking at 59 visits in the week of March 31, 2025.\n\n- **Subsequent Decline**:\n  - After reaching the peak, the visits decreased to 45 in the week of April 7, 2025, and continued to decline to 12 by the week of April 28, 2025.\n\n- **Notable Observations**:\n  - The highest number of visits was recorded in the week of March 31, 2025, with 59 visits.\n  - The lowest number of visits was in the week of April 28, 2025, with only 12 visits, indicating a sharp decline towards the end of the period.\n\nThis data suggests that while there was an initial increase in interest or activity on the search results page, it was not sustained, leading to a decrease in visits by the end of the two-month period.
`;


export interface Message {
  text: string;
  sender: 'user' | 'bot';
  type: 'message' | 'think';
  timestamp: Date,
  chatResponse?: ChatResponse;
}

@Component({
  selector: 'app-chat',
  imports: [FormsModule, NgFor, MarkdownModule, NgIf, CommonModule, BarChartComponent, MatSelectModule, MatFormFieldModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css',
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('500ms ease-in', style({ opacity: 1 }))
      ])
    ])
  ],
})
export class ChatComponent implements OnInit {
  message = '';
  placeholder = 'Type your message...';
  messages: Message[] = [];
  loggedIn$!: Observable<boolean>;
  selectedModel = 'focus'; // Default model selection

  @ViewChild('bottomAnchor') bottomAnchor?: ElementRef;

  constructor(private store: Store, private chatService: ChatService, private location: Location) {

  }

  ngOnInit(): void {
    this.loggedIn$ = this.store.select<boolean>(selectIsAuthenticated);
    const old = this.location.getState()
    if (old && Object.keys(old).indexOf('question') != -1) {
      setTimeout(() => {
        this.message = (old as any).question
        this.sendMessage()
      }, 100)
    }
  }

  toRelativeTime(date: Date): string {
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) {
      return `${seconds} seconds ago`;
    } else if (seconds < 3600) {
      const minutes = Math.floor(seconds / 60);
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else if (seconds < 86400) {
      const hours = Math.floor(seconds / 3600);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
      const days = Math.floor(seconds / 86400);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    }
  }


  formatDateString(date: Date): string {
    return this.toRelativeTime(date)
    // return date.toLocaleDateString() + ' ' + date.toLocaleTimeString(); // Adjust the format as needed
  }

  getModelDisplayName(model: string): string {
    switch (model) {
      case 'focus':
        return 'focus';
      case 'fusion':
        return 'fusion';
      default:
        return model;
    }
  }

  getDelay(message: Message): number {
    if (message.type === 'think') {
      return 100; // 1 second delay for 'think' messages
    } else {
      return Math.floor(Math.random() * (100 - 10 + 1)) + 10;
    }
  }

  typeMessage(targetMessage: Message, fullText: string, baseDelay = 100, delayStep = 50) {
    const words = fullText.split(' ');

    from(words).pipe(
      concatMap((word, index) =>
        timer(this.getDelay(targetMessage)).pipe(
          tap(() => {
            targetMessage.text += (targetMessage.text ? ' ' : '') + word;
          })
        )
      )
    ).subscribe();
  }

  sendMessage() {
    if (this.message.trim() !== '') {
      // Show user message
      this.messages.push({
        text: this.message,
        sender: 'user',
        timestamp: new Date(),
        type: 'message',
      });

      let userMessage = this.message;
      this.message = '';

      const thinkMessages: string[] = [
        "Looking at what you just asked...",
        "Finding the best match in our data...",
        "Creating the right query...",
        "Digging deeper for extra insights...",
        "Wrapping it all up for you...",
      ];


      let lastThinkIndex: number | null = null;

      const cancelInterim$ = new Subject<void>()

      // Create observable that emits one interim message every 4s
      const interimMessages$ = timer(0, 4000).pipe(
        take(thinkMessages.length),
        takeUntil(cancelInterim$),
        map(i => thinkMessages[i]),
        tap(text => {
          // Remove previous 'think' message
          if (lastThinkIndex !== null) {
            this.messages.splice(lastThinkIndex, 1);
          }

          const msgObj: Message = {
            text: '',
            sender: 'bot',
            timestamp: new Date(),
            type: 'think',
          }
          this.messages.push(msgObj)

          lastThinkIndex = this.messages.length - 1;

          this.typeMessage(msgObj, text);
        }
        )
      );
      // return;
      // API call observable
      const apiResponse$ = this.chatService.send(userMessage, this.selectedModel).pipe(
        tap(response => {
          cancelInterim$.next();
          cancelInterim$.complete();
          // Remove interim 'thinking' messages
          this.messages = this.messages.filter(msg => msg.type !== 'think');

          // Push final bot response

          const msgObj: Message = {
            text: '',
            sender: 'bot',
            timestamp: new Date(),
            type: 'message',
          }

          if (response.is_graph && response.is_graph.is_graph === 'yes' && response.result) {
            msgObj.chatResponse = response;
          }

          this.messages.push(msgObj);

          this.typeMessage(msgObj, response.result_summary ?? '');
        }),
        catchError(error => {
          cancelInterim$.next();
          cancelInterim$.complete();
          console.error('Error sending message:', error);
          return EMPTY;
        }),
        share(),
      );

      interimMessages$.subscribe()
      apiResponse$.subscribe();
    }
  }

  private dashboardStore = inject(DashboardStore)
  private dialog = inject(MatDialog)

  handlePin(message: Message) {
    const dialogRef = this.dialog.open(
      PinDialogComponent, {
      width: '50%',
      data: { title: "Add to Dashboard", message }
    })
    dialogRef.afterClosed().pipe(
      map((result) => ({
        cardId: result['access'],
        title: result['title'],
        description: result['description']
      }))
    ).subscribe(result => {
      if (result) {
        console.log(result)
        this.dashboardStore.pinQuestion({
          ...result,
          question: message.text,
        })
      }
    })
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    try {
      this.bottomAnchor?.nativeElement.scrollIntoView({ behavior: 'smooth' });
    } catch (err) {
      console.error('Scroll failed:', err);
    }
  }
}
