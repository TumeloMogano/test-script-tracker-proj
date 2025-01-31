import { Component } from '@angular/core';
import { LoadingService } from '../../../services/loading/loading.service';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss']
})
export class LoadingComponent {
  loading$ = this.loadingService.loading$;
  loadingMessage$ = this.loadingService.loadingMessage$;

  constructor(private loadingService: LoadingService) {}
}
