import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AccountHomeComponent } from './components/layout/account-home/account-home.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AccountHomeComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'document_manager';
}
