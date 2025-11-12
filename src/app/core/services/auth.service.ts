import { HttpClient } from '@angular/common/http';
import { computed, effect, inject, Injectable, signal} from '@angular/core';
import { catchError, Observable} from 'rxjs';
import { environment } from '../../../environments/environment';
import { AccessUser, AuthResponse, User } from '../../shared/models/auth.interface';
import { jwtDecode } from "jwt-decode";
import { UsuarioRequest } from '../../shared/models/usuario.interface';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private http = inject(HttpClient);
  private storageService = inject(StorageService);
  private baseUrl = environment.baseUrl;
  private storageKey: string = "user_session";

  iniciarSesion(usuario: string, password: string): Observable<AuthResponse> {
    const url = `${this.baseUrl}${environment.prefijos.auth.login}`;
    return this.http.post<AuthResponse>(url, {"username": usuario, "password": password, "expiresInMins": 5});
  }

  obtenerInformacionUsuario(): Observable<any> {
    const url = `${this.baseUrl}${environment.prefijos.auth.getUser}`;
    return this.http.get<AuthResponse>(url);
  }

  refrescarUsuario(refreshT: string): Observable<AccessUser> {
    const url = `${this.baseUrl}${environment.prefijos.auth.refresh}`;
    return this.http.post<AccessUser>(url,{"refreshToken": refreshT});
  }

  registrarUsuario(data: UsuarioRequest): Observable<User> {
    const url = `${this.baseUrl}${environment.prefijos.user.add}`;
    return this.http.post<User>(url, data);
  }

  isAuthenticated(): boolean {
    return this.getToken() !== null;
  }

  isTokenExpired(token: string): boolean {
    try {
      const decoded: { exp: number } = jwtDecode(token);
      const expiration = decoded.exp * 1000;
      return Date.now() >= expiration;
    } catch (e) {
      return true;
    }
  }

  getToken(): string | null {
    const token = this.storageService.getItem('token_user');
    if (!token) {
      // alert('No hay sesión activa. Conéctate para continuar.');
      return null;
    }

    try {
      const payloadBase64 = token.split('.')[1];
      if (!payloadBase64) throw new Error('Formato de token inválido');

      const payload = JSON.parse(atob(payloadBase64));
      const isExpired = payload.exp * 1000 < Date.now();

      if (isExpired) {
        alert('La sesión ha expirado. Conéctate de nuevo.');
        this.storageService.removeItem('token_user');
        return null;
      }

      return token;
    } catch (error) {
      console.error('Error al validar el token:', error);
      this.storageService.removeItem('token_user'); // Borra el token inválido
      alert('Sesión inválida. Conéctate de nuevo.');
      return null;
    }
  }
  
}
