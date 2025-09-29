import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  showSignup = false;
  loginForm: FormGroup;
  errorMessage: string | null = null;
  firstname = '';
  lastname = '';
  email = '';
  username = '';
  password = '';
  errorMsg: string | null = null;
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  openSignup() { this.showSignup = true; }
  closeSignup() { this.showSignup = false; }

   onSignup(): void {
    if (!this.firstname || !this.lastname || !this.email || !this.username || !this.password) {
      this.errorMsg = 'Please fill in all fields';
      return;
    }

    this.authService.signup({
      first_name: this.firstname,
      last_name: this.lastname,
      email: this.email,
      username: this.username,
      password: this.password
    }).subscribe({
      next: () => {
        alert('Signup successful! Please login.');
        this.closeSignup();
      },
      error: (err) => {
        console.error(err);
        this.errorMsg = err.error?.detail || 'Signup failed.';
      }
    });
  }

  
  onLogin() {
    if (this.loginForm.invalid) {
      this.errorMessage = 'Please fill in all fields';
      return;
    }

    const { username, password } = this.loginForm.value;

    this.authService.login(username, password).subscribe({
      next: () => {
        this.errorMessage = null;
        this.router.navigateByUrl('/account');
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Invalid username or password';
      }
    });
  }
}
