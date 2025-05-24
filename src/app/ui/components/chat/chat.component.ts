import { NgFor, NgIf } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MarkdownModule } from 'ngx-markdown';
import { Store } from '@ngrx/store';
import { selectIsAuthenticated } from '../../../auth/state/auth.selectors';
import { AuthActions } from '../../../auth/state/auth.actions';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';

const TEMP = `
### Summary of Weekly Search Results Page Visits\n\n- **Overall Trend**: Over the last two months, there is a noticeable fluctuation in the number of weekly visits to the search results page, with a general upward trend followed by a decline towards the end of the period.\n\n- **Initial Increase**: \n  - The visits started at 15 in the week of February 24, 2025.\n  - There was a significant increase in the following weeks, peaking at 59 visits in the week of March 31, 2025.\n\n- **Subsequent Decline**:\n  - After reaching the peak, the visits decreased to 45 in the week of April 7, 2025, and continued to decline to 12 by the week of April 28, 2025.\n\n- **Notable Observations**:\n  - The highest number of visits was recorded in the week of March 31, 2025, with 59 visits.\n  - The lowest number of visits was in the week of April 28, 2025, with only 12 visits, indicating a sharp decline towards the end of the period.\n\nThis data suggests that while there was an initial increase in interest or activity on the search results page, it was not sustained, leading to a decrease in visits by the end of the two-month period.
`;


interface Message {
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

@Component({
  selector: 'app-chat',
  imports: [FormsModule, NgFor, MarkdownModule, NgIf, CommonModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent implements OnInit {
  message = '';
  placeholder = 'Type your message...';
  messages: Message[] = [];
  loggedIn$!: Observable<boolean>;

  @ViewChild('bottomAnchor') bottomAnchor?: ElementRef;

  constructor(private store: Store) { }

  ngOnInit(): void {
    this.loggedIn$ = this.store.select<boolean>(selectIsAuthenticated);
  }

  dummyRecieve() {

    const dummyResponse = TEMP;
    this.messages.push({ text: dummyResponse, sender: 'bot', timestamp: new Date() });
  }

  formatDateString(date: Date): string {
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString(); // Adjust the format as needed
  }

  sendMessage() {
    console.log("Dummy recieve");
    this.store.dispatch(AuthActions.login({ email: "akash10@email.com", password: "password" }));
    if (this.message.trim() !== '') {
      this.messages.push({ text: this.message, sender: 'user', timestamp: new Date() });
      this.message = '';
      setTimeout(() => {
        this.dummyRecieve();
      }, 1000);
    }
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
