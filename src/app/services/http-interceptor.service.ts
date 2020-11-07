import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { environment, _fetchRetryCount } from '../../environments/environment';

@Injectable()
export class HttpInterceptorService implements HttpInterceptor {

  messageError: string;

  constructor(private toastr: ToastrService) {

  }


    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      // Add Auth Token
      // In Production you would get the token value from an auth service

    const reqWithAuth = req.clone(
        {
          setHeaders: {
            Authorization: `Your ApiKey`
          }
        }
      );
    return next.handle(reqWithAuth)
      .pipe(
        // Retry on failure
        retry(_fetchRetryCount),

        // Handle errors
        catchError(
          (error: HttpErrorResponse) =>  {
            // Add error logic here, show spinner or toastr
            this.messageError = `Status : ${error.status} \n Message : ${error.message}`;
            this.toastr.warning(this.messageError, 'Error');
            return throwError(error);
          }
        )
      );
    }
}