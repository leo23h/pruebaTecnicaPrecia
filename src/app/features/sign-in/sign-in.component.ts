import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { StorageService } from '../../core/services/storage.service';
import { UsuarioRequest } from '../../shared/models/usuario.interface';

@Component({
  selector: 'app-sign-in',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    CommonModule,
    ReactiveFormsModule,
  ],
  providers: [AuthService],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.css',
})
export class SignInComponent implements OnInit {
  // inject dependencies
  private router = inject(Router);
  private AuthService = inject(AuthService);
  private storageService = inject(StorageService);
  // variables
  hide = signal(true);
  loginForm!: FormGroup;
  registroForm!: FormGroup;

  constructor() {}

  ngOnInit(): void {
    this.hide.set(false);
    this.crearFormularioIngreso();
    this.crearFormularioRegistro();
  }

  crearFormularioIngreso() {
    this.loginForm = new FormGroup({
      usuario: new FormControl('', [Validators.required]),
      contrasena: new FormControl('', [Validators.required]),
    });
  }

  crearFormularioRegistro() {
    this.registroForm = new FormGroup({
      usuario: new FormControl('', [Validators.required]),
      nombre: new FormControl('', [Validators.required]),
      apellido: new FormControl('', [Validators.required]),
      telefono: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      contrasena: new FormControl('', [Validators.required]),
      repetirContrasena: new FormControl('', [Validators.required]),
    });
  }

  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  ingresar() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
    } else {
      console.log('Formulario de ingreso válido:', this.loginForm.value);
      this.iniciarSesion();
      // this.navigateTo('dashboard');
    }
  }

  registrarUsuario() {
    if (this.registroForm.invalid) {
      this.registroForm.markAllAsTouched();
    } else {
      console.log('Formulario de registro válido:', this.registroForm.value);
      this.registroUsuario();
    }
  }

  navigateTo(urlToNavigate: string, id?: number) {
    this.router.navigate([`/${urlToNavigate}`]);
  }

  registroUsuario() {
    const usuarioData: UsuarioRequest = {
      username: this.registroForm.value.usuario,
      firstname: this.registroForm.value.nombre,
      lastname: this.registroForm.value.apellido,
      email: this.registroForm.value.email,
      phone: this.registroForm.value.telefono,
      password: this.registroForm.value.contrasena,
    };

    if (this.registroForm.value.contrasena != this.registroForm.value.repetirContrasena
    ) {
      Swal.fire({
        title: 'Error!',
        text: 'Las contraseñas no coinciden',
        icon: 'error',
        confirmButtonText: 'OK',
      });
      return;
    } else {
      this.AuthService.registrarUsuario(usuarioData).subscribe({
        next: (response) => {
          console.log('Usuario registrado:', response);
          Swal.fire({
            title: 'Éxito!',
            text: 'Usuario registrado correctamente',
            icon: 'success',
            confirmButtonText: 'OK',
          });
          this.navigateTo('auth');
          this.registroForm.reset(); 
        },
        error: (error) => {
          console.error('Error al registrar usuario:', error);
          Swal.fire({
            title: 'Error!',
            text: 'No se pudo registrar el usuario',
            icon: 'error',
            confirmButtonText: 'OK',
          });
        },
      });
    }
  }

  passwordsMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordsMismatch: true };
  }

  iniciarSesion() {
    this.AuthService.iniciarSesion(this.loginForm.value.usuario, this.loginForm.value.contrasena).subscribe({
      next: (response) => {
        console.log('Inicio de sesión exitoso:', response);
        if(response && response.accessToken) {
          this.storageService.setItem('token_user', response.accessToken);
          this.storageService.setItem('user_session', JSON.stringify(response));
          this.router.navigate(['/dashboard']);
        }else{
          Swal.fire({
            title: 'Error!',
            text: 'Usuario y/o contraseña incorrectos',
            icon: 'error',
            confirmButtonText: 'OK',
          });
        }
      },
      error: (error) => {
        console.error('Error al iniciar sesión:', error);
        Swal.fire({
          title: 'Error!',
          text: 'Usuario y/o contraseña incorrectos',
          icon: 'error',
          confirmButtonText: 'OK',
        });
      },
    });
  }

  obtenerInformacionEstudiantePorIdUsuario(idUsuario: number) {
    // this.estudianteService.obtenerEstudiantePorUsuario(idUsuario).subscribe({
    //   next: (response) => {
    //     console.log('Información del estudiante:', response);
    //     this.signinService.informacionEstudiante.set(response);
    //     sessionStorage.setItem('estudiante', JSON.stringify(response));
    //   },
    //   error: (error) => {
    //     console.error('Error al obtener información del estudiante:', error);
    //   },
    // });
  }
}
