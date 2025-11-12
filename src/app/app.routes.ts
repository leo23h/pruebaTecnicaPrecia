import { Routes } from '@angular/router';
import { SignInComponent } from './features/sign-in/sign-in.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { NotfoundComponent } from './shared/components/notfound/notfound.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', component: DashboardComponent, canActivate: [authGuard]},
  { path: 'auth', component: SignInComponent },
  { path: 'dashboard', loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent), canActivate: [authGuard]},
  { path: '**', component: NotfoundComponent } // Redirige a SignInComponent para cualquier ruta no definida,
];
