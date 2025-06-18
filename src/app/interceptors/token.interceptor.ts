import {inject} from '@angular/core';
import {HttpHandlerFn, HttpRequest} from '@angular/common/http';

import {AuthService} from '../services/auth.service';

export function TokenInterceptor(request:HttpRequest<any>, next:HttpHandlerFn) {
        const authService = inject(AuthService);
        const token = authService.getToken();
        console.log('TokenInterceptor: token', token);
        console.log('TokenInterceptor: request', request);

      if (request.url.includes('/github') || request.url.includes('/login') || request.url.includes('/users/token')) {
        return next(request);
      }

        if (token) {
            request = request.clone({
                setHeaders: {Authorization: `Bearer ${token}`}
            });
        }

        return next(request);
    };
