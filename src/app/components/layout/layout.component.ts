import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterOutlet],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent {
  chatbotOpen = false;

  toggleChatbot() {
    this.chatbotOpen = !this.chatbotOpen;
  }

  logout() {
    localStorage.removeItem('token');
    window.location.href = '/';
  }
}
