import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { StorageService } from '../../../core/services/storage.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-menu',
  imports: [],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent implements OnInit {
 
  private  router = inject(Router);
  private authService = inject(AuthService);
  private storageService = inject(StorageService);
  private subscription: Subscription | undefined;

  ngOnInit(): void {
    this.cargarInformacionEstudiante();
  }

  cargarInformacionEstudiante() {
    // setTimeout(() => {
    //   this.estudianteInfo = JSON.parse(
    //     this.storageService.getItem('estudiante') || '{}'
    //   );
    // }, 500);
  }


  cerrarSesion() {
    // Aquí puedes agregar la lógica para cerrar sesión
    console.log('Sesión cerrada');
    this.storageService.removeItem('token_user');
    this.storageService.removeItem('user_session');
    this.navigateTo('auth');
  }

  navigateTo (urlToNavigate: string, id?: number) {
    this.router.navigateByUrl(`${urlToNavigate}`);
  }
}
