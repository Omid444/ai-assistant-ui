import { Routes } from '@angular/router';
import { HomeComponent } from './components/login/home.component';
import { LayoutComponent } from './components/layout/layout.component';
import { authGuard } from './services/auth/auth.guard';
import { AccountHomeComponent } from './components/layout/account-home/account-home.component';
import { DashboardComponent } from './components/layout/dashboard/dashboard.component';


export const routes: Routes = [
  { path: '', component: HomeComponent }, 
  {
    path: 'account',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: AccountHomeComponent },
      { path: 'dashboard', component: DashboardComponent },
    //   { path: 'about', component: AboutComponent },
    //   { path: 'contact', component: ContactComponent }
    ]
  },
  { path: '**', redirectTo: '' }
];
