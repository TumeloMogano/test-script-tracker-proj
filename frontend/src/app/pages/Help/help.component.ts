import { Component, OnInit } from '@angular/core';
import { HelpPage, HelpService } from '../../services/Help/help.service';

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrl: './help.component.scss'
})
export class HelpComponent implements OnInit {
  helpPages: HelpPage[] = [];
  filteredHelpPages: HelpPage[] = [];
  expandedHelpPageId: number | null = null;
  searchQuery: string = '';

  constructor(private helpService: HelpService) {}

  ngOnInit(): void {
    this.loadHelpPageItems();
  }

  loadHelpPageItems(): void {
    this.helpService.getHelpPageItems().subscribe(
      (data) => {
        this.helpPages = data;
        this.filteredHelpPages = data; // Initialize filteredHelpPages
      },
      (error) => {
        console.error('Error fetching help pages:', error);
      }
    );
  }

  toggleHelpPage(helpPageId: number): void {
    this.expandedHelpPageId = this.expandedHelpPageId === helpPageId ? null : helpPageId;
  }

  downloadHelpPdf(): void {
    window.open('https://localhost:7089/api/Help/generate-help-pdf', '_blank');
  }

  openHelpPdf(){
    const pdfUrl = 'assets/ttshelp.pdf';
    window.open(pdfUrl, '_blank');
  }

  onSearch(): void {
    const query = this.searchQuery.trim().toLowerCase();

    if (query) {
      this.helpService.searchHelpPageItems(query).subscribe(
        (data) => {
          this.filteredHelpPages = data;
        },
        (error) => {
          console.error('Error searching help pages:', error);
        }
      );
    } else {
      this.filteredHelpPages = this.helpPages;
    }
  }
}
