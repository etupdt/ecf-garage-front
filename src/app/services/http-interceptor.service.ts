import { HttpEvent, HttpHandler, HttpRequest } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HttpInterceptorService {

  constructor(
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if (request.method === 'POST' && (request.url === `${environment.useBackend}/api/login`)) {

      return next.handle(request)

    } else {

      const token = localStorage.getItem('tokenAuth');

      if (token) {
        request = request.clone({
          setHeaders: {
            Authorization: 'Bearer ' + token
          }
        });
        return next.handle(request)
      } else {
        throw({error: new Error('Erreur token non trouvé')});
      }

    }

  }

}
