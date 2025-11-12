import type { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const token = auth.getToken();
  const isExpired = auth.isTokenExpired(token!);

  if (token && isExpired) {
    alert('Sesión expirada, Tu sesión ha expirado. Debes iniciar sesión nuevamente.');
  }

  if (token && !isExpired) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });

    return next(authReq);
  }

  return next(req);
};
