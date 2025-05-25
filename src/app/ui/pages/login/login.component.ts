import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { AuthActions } from '../../../auth/state/auth.actions';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email = '';
  password = '';


  constructor(private store: Store) { }

  handleLogin() {
    // Validate email and password
    console.log(this.email, this.password);
    if (!this.isValidEmail(this.email) || this.password.length < 6) {
      alert('Invalid email or password. Please check your credentials.');
      return;
    }
    this.store.dispatch(AuthActions.login({ email: "akash10@email.com", password: "password" }));

  }

  isValidEmail(email: string): boolean {
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
