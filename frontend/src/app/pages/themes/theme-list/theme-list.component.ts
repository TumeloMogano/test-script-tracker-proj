import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ThemeService } from '../../../services/theme/theme.service';
import { Theme } from '../../../models/theme';

@Component({
  selector: 'app-theme-list',
  templateUrl: './theme-list.component.html',
  styleUrls: ['./theme-list.component.scss']
})
export class ThemeListComponent implements OnInit {
  clientId!: string;
  themes: Theme[] = [];
  numThemes: number = 0;

  constructor(
    private route: ActivatedRoute,
    private themeService: ThemeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.clientId = '';
    this.loadThemes();
  }

  loadThemes(): void {
    this.themeService.getClientThemes(this.clientId).subscribe((themes: Theme[]) => {
      this.themes = themes;
      this.numThemes = this.themes.length;
    });
  }

  viewThemeDetails(themeId: string): void {
    this.router.navigate(['/theme-details', themeId]);
  }

  deleteTheme(themeId: string): void {
    if (confirm('Are you sure you want to delete this theme?')) {
      this.themeService.deleteTheme(themeId).subscribe(() => {
        this.loadThemes();
      });
    }
  }
}
