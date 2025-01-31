import { Component, OnInit } from '@angular/core';
import { ReportService } from '../../../services/report/report.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AuthUser } from '../../../models/auth/auth.model';
import { AuthService } from '../../../services/auth/auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-active-projects-report',
  templateUrl: './active-projects-report.component.html',
  styleUrls: ['./active-projects-report.component.scss']
})
export class ActiveProjectsReportComponent implements OnInit {
  user$: Observable<AuthUser | null>;
  loggedInUser: AuthUser | null = null;

  projects: any[] = [];
  filteredProjects: any[] = [];
  searchCriteria: string = '';
  page: number = 1;
  order: string = 'projectName';
  reverse: boolean = false;
  minDate: string = '';
  maxDate: string = '';
  dateType: string = 'startDate';
  days: string = '';
  daysType: string = '';

  constructor(
    private reportService: ReportService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private authService: AuthService
  ) { 
    this.user$ = this.authService.userDetails$;
  }

  ngOnInit(): void {
    this.loadReport();
    this.authService.userDetails$.subscribe(user => {
      this.loggedInUser = user;
    });
  }

  loadReport(): void {
    this.reportService.getActiveProjectsReport().subscribe(data => {
      this.projects = data;
      this.filteredProjects = data;
    });
  }

  filterByDateRange(): void {
    const minDate = this.minDate ? new Date(this.minDate) : null;
    const maxDate = this.maxDate ? new Date(this.maxDate) : null;

    this.filteredProjects = this.projects.filter(project => {
      const projectDate = new Date(project[this.dateType]);
      projectDate.setHours(0, 0, 0, 0);

      if (minDate) {
        minDate.setHours(0, 0, 0, 0);
      }
      if (maxDate) {
        maxDate.setHours(23, 59, 59, 999);
      }

      if (minDate && maxDate) {
        return projectDate >= minDate && projectDate <= maxDate;
      } else if (minDate) {
        return projectDate >= minDate;
      } else if (maxDate) {
        return projectDate <= maxDate;
      } else {
        return true;
      }
    });

    this.sortProjects();
  }

  filterByDays(): void {
    const days = parseInt(this.days);
    const today = new Date();
    const pastDate = new Date();
    pastDate.setDate(today.getDate() - days);
    pastDate.setHours(0, 0, 0, 0);
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + days);
    futureDate.setHours(23, 59, 59, 999);
  
    if (this.daysType === 'last') {
      this.filteredProjects = this.projects.filter(project => {
        const projectStartDate = new Date(project.startDate);
        projectStartDate.setHours(0, 0, 0, 0);
        return projectStartDate >= pastDate && projectStartDate <= today;
      });
    } else if (this.daysType === 'upcoming') {
      this.filteredProjects = this.projects.filter(project => {
        const projectEndDate = new Date(project.endDate);
        projectEndDate.setHours(0, 0, 0, 0);
        return projectEndDate >= today && projectEndDate <= futureDate;
      });
    }
  
    this.sortProjects();
  }
  

  clearFilters(): void {
    this.minDate = '';
    this.maxDate = '';
    this.days = '';
    this.filteredProjects = [...this.projects];
  }

  setOrder(value: string, reverse: boolean): void {
    this.order = value;
    this.reverse = reverse;
    this.sortProjects();
  }

  sortProjects(): void {
    this.filteredProjects.sort((a, b) => {
      let comparison = 0;
      if (a[this.order] > b[this.order]) {
        comparison = 1;
      } else if (a[this.order] < b[this.order]) {
        comparison = -1;
      }
      return this.reverse ? comparison * -1 : comparison;
    });
  }

  exportToPDF(): void {
    this.confirmationService.confirm({
      header: 'Confirmation',
      message: 'Are you sure you want to export this report?',
      accept: () => {
        const doc = new jsPDF();
        const currentTime = new Date();
        const date = currentTime.toLocaleDateString().replace(/\//g, '-');
        const time = currentTime.toLocaleTimeString().replace(/:/g, '-');

        let dateRangeText = '';
        if (this.minDate && this.maxDate) {
          dateRangeText = `Applied Filter: Projects between ${this.minDate} and ${this.maxDate}`;
        } else if (this.days) {
          dateRangeText = `Applied Filter: Projects in the last ${this.days} days`;
        }

        // Load the logo from assets
        const img = new Image();
        img.src = 'assets/company-logo.png';
        img.onload = () => {
          doc.addImage(img, 'PNG', 10, 15, 50, 20);

          doc.setFont('Arial');

          doc.setFontSize(18);
          doc.text('EPI-USE Africa', 70, 20);

          doc.setFontSize(10);
          doc.text(`Generated on:`, 70, 25);

          doc.setFontSize(10);
          doc.text(`Date: ${date} Time: ${time}`, 70, 30);

          const generatedBy = this.loggedInUser ? `${this.loggedInUser.firstName} ${this.loggedInUser.surname}` : 'Unknown User';
          doc.setFontSize(10);
          doc.setFont('Arial', 'normal');
          doc.text(`Report generated by: ${generatedBy}`, 70, 35);

          doc.setLineWidth(0.5);
          doc.line(10, 40, 200, 40);

          doc.setFontSize(14);
          doc.setFont('Arial', 'bold');
          doc.text('Active Projects Report', 10, 45);

          if (dateRangeText) {
            doc.setFontSize(11);
            doc.setFont('Arial', 'normal');
            doc.text(dateRangeText, 10, 50);
          } else {
            doc.setFontSize(11);
            doc.setFont('Arial', 'normal');
            doc.text('No filter applied', 10, 50);
          }

          doc.setFontSize(12);
          doc.setFont('Arial', 'bold');
          doc.text('List of Active Projects', 10, 60);

          (doc as any).autoTable({
            startY: 65,
            head: [['Project Name', 'Start Date', 'End Date', 'Client Name']],
            body: this.filteredProjects.map(project => [project.projectName, project.startDate, project.endDate, project.clientName]),
            headStyles: { fillColor: [0, 24, 68] },
            didDrawPage: (data: any) => {
              const pageSize = (doc as any).internal.pageSize;
              const pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
              doc.setFontSize(10);
              doc.setFont('Arial', 'normal');
              doc.text('Generated from the Test Script Tracker Application', data.settings.margin.left, pageHeight - 10);
              doc.text(`Page ${data.pageNumber}`, pageSize.width - data.settings.margin.right - 10, pageHeight - 10);
            }
          });

          doc.save(`ActiveProjectsReport_${date}_${time}.pdf`);
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Report exported successfully', key: 'bc' });
        };
      },
      reject: () => {
        this.messageService.add({ severity: 'info', summary: 'Cancelled', detail: 'Export cancelled', key: 'bc' });
      }
    });
  }
}