import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private messageSubject = new BehaviorSubject<string>('Loading...');

  loading$: Observable<boolean> = this.loadingSubject.asObservable();
  loadingMessage$: Observable<string> = this.messageSubject.asObservable();

  show(message: string = 'Loading...'): void {
    this.messageSubject.next(message);
    this.loadingSubject.next(true);
  }

  hide(): void {
    this.loadingSubject.next(false);
  }
  
}
