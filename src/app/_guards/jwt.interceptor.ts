import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from '../_services/authentication.service';
import { AUTHORIZATION_ERROR } from '../constant/shared-constant';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('COMPANY-USER-TOKEN');

    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "true"
          
        },
      });
    } else {
      request = request.clone({
        setHeaders: {
          "ngrok-skip-browser-warning": "true"
          
        },
      });
    }

    // return next.handle(request);
    return next.handle(request).pipe(
      catchError((err: HttpErrorResponse) => {
        console.error('err: ', err);
        if (err.error.err_msg === AUTHORIZATION_ERROR || err.status === 401) {
          this.authService.signOut();
          this.router.navigate(['/login']);
        }
        return throwError(err);
      })
    );
  }
}
