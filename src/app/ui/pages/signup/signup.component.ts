import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { AuthActions } from '../../../auth/state/auth.actions';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-signup',
  imports: [CommonModule, FormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
  username = ''
  email = '';
  password = '';


  constructor(private store: Store) { }

  handleLogin() {

    if (this.username.trim().length <= 0) {
      alert('Username cannot be empty')
      return
    }
    if (!this.isValidEmail(this.email) || this.password.length < 6) {
      alert('Invalid email or password. Please check your credentials.');
      return;
    }
    this.store.dispatch(AuthActions.signup({ name: this.username, email: this.email, password: this.password }));

  }

  isValidEmail(email: string): boolean {
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
