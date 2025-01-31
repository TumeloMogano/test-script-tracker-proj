import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { finalize, delay, tap, switchMap } from 'rxjs/operators';
import { LoadingService } from '../../../../../services/loading/loading.service';
import { LoadingMessages } from '../../../../resources/loading-config';


@Injectable()
export class LoadingInterceptor implements HttpInterceptor {

  constructor(private loadingService: LoadingService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const loadingConfig = LoadingMessages.find(config => req.url.includes(config.url));

    if (loadingConfig) {
      this.loadingService.show(loadingConfig.message);

      return next.handle(req).pipe(
        finalize(() => this.loadingService.hide())
      );
    } else {
      return next.handle(req);
    }

    // if (req.url.includes('/Sign-in') || req.url.includes('/UpdateConfiguration' || )) {
    //   const message = req.url.includes('/Sign-in') ? 'Checking Security...' : 'Updating Role Permissions...';
    //   this.loadingService.show(message);
      
    //   return next.handle(req).pipe(
    //     finalize(() => this.loadingService.hide())
    //   );
    // } else {
    //   return next.handle(req);
    // }

  }
}
