import { Component } from '@angular/core';
import { AccountService } from '../../../services/account.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-account-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './account-home.component.html',
  styleUrl: './account-home.component.css'
})
export class AccountHomeComponent {
username: string | null = '';

  constructor(private accountService: AccountService) {
    // فرض می‌کنیم username در توکن ذخیره شده
    const token = localStorage.getItem('auth_token');
    if (token) {
      // توکن JWT معمولاً به شکل "header.payload.signature" هست
      const payload = JSON.parse(atob(token.split('.')[1]));
      this.username = payload.sub; // چون تو بک‌اند sub = username
    }
  }
  ngOnInit() {
    this.accountService.getFirstname().subscribe({
      next: (res) => {
        if (res && res.firstname) {
          this.username = res.firstname;
        }
      },
      error: (err) => {
        console.error('Error fetching firstname:', err);
      }
    });
  }
}
