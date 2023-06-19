import { HttpEvent, HttpHandler, HttpRequest } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HttpInterceptorService {

  jwtHelper = new JwtHelperService();

  constructor(
  ) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if (request.method === 'POST' && (request.url === `${environment.useBackend}/api/login`)) {

      return next.handle(request)

    } else {

      const token = localStorage.getItem('tokenAuth');

      if (token) {

        if (this.jwtHelper.isTokenExpired(token)) {
          localStorage.removeItem('tokenAuth')
        } else {
          request = request.clone({
            setHeaders: {
              Authorization: 'Bearer ' + token
            }
          });
        }

        return next.handle(request)

      } else {

        return next.handle(request)

      }

    }

  }

}
