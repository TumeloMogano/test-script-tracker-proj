import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ReportService } from '../../../services/report/report.service';
import { FormControl } from '@angular/forms';
import Chart from 'chart.js/auto';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import 'jspdf-autotable';
import { debounceTime, switchMap } from 'rxjs/operators';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AuthUser } from '../../../models/auth/auth.model';
import { AuthService } from '../../../services/auth/auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-defects-report',
  templateUrl: './defects-report.component.html',
  styleUrls: ['./defects-report.component.scss']
})
export class DefectsReportComponent implements OnInit {
  defectsReport: any[] = [];
  projects: any[] = [];
  selectedProject: any | null = null;
  projectFilterControl = new FormControl();
  @ViewChild('barChart') barChartRef!: ElementRef;
  sortField: string = 'projectName';
  sortOrder: boolean = true;
  page: number = 1;
  pageSize: number = 10;

  totalDefects: number = 0;
  defectStatusCounts: { [status: string]: number } = {};
  chart: Chart | null = null; 
  isFilterApplied: boolean = false;
  user$: Observable<AuthUser | null>;
  loggedInUser: AuthUser | null = null;

  constructor(
    private defectsReportService: ReportService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private authService: AuthService
  ) {
    this.user$ = this.authService.userDetails$;
  }

  ngOnInit(): void {
    this.getProjects();
    this.projectFilterControl.valueChanges
      .pipe(
        debounceTime(300),
        switchMap(value => this.defectsReportService.searchProjects(value))
      )
      .subscribe((projects: any[]) => {
        this.projects = projects;
      });
    this.getDefectsReport();
    this.authService.userDetails$.subscribe(user => {
      this.loggedInUser = user;
    });
  }

  getProjects(): void {
    this.defectsReportService.getProjects().subscribe(
      (projects: any[]) => {
        this.projects = projects;
      },
      error => console.error(error)
    );
  }

  getDefectsReport(projectId?: number): void {
    this.defectsReportService.getDefectsReport(projectId).subscribe(
      (data: any[]) => {
        this.defectsReport = data.map(project => ({
          ...project,
          totalDefects: project.defectStatuses.reduce((sum: number, status: { defectCount: number }) => sum + status.defectCount, 0)
        }));
        this.calculateTotals();
        this.sortData();
        this.updateChart();
      },
      error => console.error(error)
    );
  }

  calculateTotals(): void {
    this.totalDefects = this.defectsReport.reduce((sum: number, report: { totalDefects: number }) => {
      return sum + report.totalDefects;
    }, 0);
    this.defectStatusCounts = this.defectsReport.reduce((acc: { [status: string]: number }, report: { defectStatuses: { defectStatusName: string, defectCount: number }[] }) => {
      report.defectStatuses.forEach((status: { defectStatusName: string, defectCount: number }) => {
        if (acc[status.defectStatusName]) {
          acc[status.defectStatusName] += status.defectCount;
        } else {
          acc[status.defectStatusName] = status.defectCount;
        }
      });
      return acc;
    }, {} as { [status: string]: number });
  }

  updateChart(): void {
    try {
      if (this.chart) {
        this.chart.destroy();
      }

      if (this.defectsReport.length > 0 && this.barChartRef && this.barChartRef.nativeElement) {
        const labels = Object.keys(this.defectStatusCounts);
        const data = Object.values(this.defectStatusCounts);

        this.chart = new Chart(this.barChartRef.nativeElement, {
          type: 'bar',
          data: {
            labels: labels,
            datasets: [{
              label: 'Defects',
              data: data,
              backgroundColor: ['#0380bb', '#00b050', '#fae200', '#ff9300'],
              borderColor: ['#0380bb', '#00b050', '#fae200', '#ff9300'],
              borderWidth: 1
            }]
          },
          options: {
            responsive: true,
            scales: {
              y: {
                beginAtZero: true,
                title: {
                  display: true,
                  text: 'Defect Count'
                }
              }
            },
            plugins: {
              datalabels: {
                anchor: 'center',
                align: 'center',
                color: '#fff',
                font: {
                  weight: 'bold' as const,
                  size: 14
                }
              }
            }
          }
        });
      }
    } catch (error) {
      console.error('Error creating chart:', error);
    }
  }

  setOrder(field: string, order: boolean): void {
    this.sortField = field;
    this.sortOrder = order;
    this.sortData();
    this.updateChart();
  }

  sortData(): void {
    this.defectsReport.sort((a, b) => {
      let fieldA = a[this.sortField];
      let fieldB = b[this.sortField];

      if (typeof fieldA === 'string' && typeof fieldB === 'string') {
        fieldA = fieldA.toLowerCase();
        fieldB = fieldB.toLowerCase();
      }

      if (fieldA < fieldB) {
        return this.sortOrder ? -1 : 1;
      } else if (fieldA > fieldB) {
        return this.sortOrder ? 1 : -1;
      } else {
        return 0;
      }
    });
  }

  exportToPDF(): void {
    this.confirmationService.confirm({
      header: 'Confirmation',
      message: 'Are you sure you want to export this report?',
      accept: async () => {
        const doc = new jsPDF('p', 'mm', 'a4');
        const currentTime = new Date();
        const date = currentTime.toLocaleDateString().replace(/\//g, '-');
        const time = currentTime.toLocaleTimeString().replace(/:/g, '-');
  
        const img = new Image();
        img.src = 'assets/company-logo.png';
        await new Promise((resolve) => {
          img.onload = resolve;
        });
  
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const margins = { top: 45, bottom: 20, left: 10, right: 10 };
        let yOffset = margins.top;
  
        doc.addImage(img, 'PNG', margins.left, 15, 50, 20);
  
        const generatedBy = this.loggedInUser ? `${this.loggedInUser.firstName} ${this.loggedInUser.surname}` : 'Unknown User';
  
        doc.setFont('Arial');
        doc.setFontSize(18);
        doc.text('EPI-USE Africa', margins.left + 60, 20);
  
        doc.setFontSize(10);
        doc.text(`Generated on:`, margins.left + 60, 25);
        doc.text(`Date: ${date} Time: ${time}`, margins.left + 60, 30);
        doc.text(`Report generated by: ${generatedBy}`, margins.left + 60, 35);
  
        doc.setLineWidth(0.5);
        doc.line(margins.left, 40, pageWidth - margins.right, 40);
  
        doc.setFontSize(14);
        doc.setFont('Arial', 'bold');
        doc.text('Defects Report', margins.left, yOffset);
        yOffset += 5;
  
        if (this.isFilterApplied && this.selectedProject) {
          doc.setFontSize(11);
          doc.setFont('Arial', 'normal');
          doc.text(`Defects for ${this.selectedProject.projectName}`, margins.left, yOffset);
          yOffset += 5;
        } else {
          doc.setFontSize(11);
          doc.setFont('Arial', 'normal');
          doc.text(`Defects for across all active projects`, margins.left, yOffset);
          yOffset += 5;
        }
  
        const chartCanvas = this.barChartRef.nativeElement as HTMLCanvasElement;
        const chartDataUrl = chartCanvas.toDataURL('image/png');
        doc.addImage(chartDataUrl, 'PNG', margins.left, yOffset, (pageWidth - margins.left - margins.right) / 2 - 5, 60);
  
        let colYOffset = yOffset;
        doc.setFontSize(12);
        doc.setFont('Arial', 'bold');
        doc.text(`Total Defects: ${this.totalDefects}`, margins.left + (pageWidth / 2) + 5, colYOffset);
        colYOffset += 5;
  
        Object.keys(this.defectStatusCounts).forEach(status => {
          if (colYOffset + 10 > pageHeight - margins.bottom) {
            doc.addPage();
            colYOffset = margins.top;
          }
          doc.setFontSize(10);
          doc.setFont('Arial', 'normal');
          doc.text(`${this.defectStatusCounts[status]} ${status} Defects`, margins.left + (pageWidth / 2) + 5, colYOffset);
          colYOffset += 5;
        });
  
        yOffset += 70;
  
        this.defectsReport.forEach(project => {
          if (yOffset + 20 > pageHeight - margins.bottom) {
            doc.addPage();
            yOffset = margins.top;
          }
          doc.setFontSize(12);
          doc.setFont('Arial', 'bold');
          doc.text(`Defects for ${project.projectName}`, margins.left, yOffset);
          yOffset += 5;
  
          const headers = [['Defect Status', 'Defect Count', 'Defect Descriptions']];
          const rows = project.defectStatuses.map((status: { defectStatusName: string, defectCount: number, defects: { defectDescription: string }[] }) => [
            status.defectStatusName,
            status.defectCount.toString(),
            status.defects.map((defect: { defectDescription: string }) => defect.defectDescription).join(', ')
          ]);
  
          (doc as any).autoTable({
            startY: yOffset,
            head: headers,
            body: rows,
            margin: { top: 10, bottom: 10, left: margins.left, right: margins.right },
            headStyles: { fillColor: [0, 24, 68] },
            didDrawPage: (data: any) => {
              yOffset = data.cursor.y;
              //Footer
              const pageSize = doc.internal.pageSize;
              const pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
              doc.setFontSize(10);
              doc.setFont('Arial', 'normal');
              doc.text('Generated from the Test Script Tracker Application', data.settings.margin.left, pageHeight - 10);
              doc.text(`Page ${data.pageNumber}`, pageSize.width - data.settings.margin.right - 10, pageHeight - 10);
            },
            willDrawCell: (data: any) => {
              if (yOffset + 20 > pageHeight - margins.bottom) {
                doc.addPage();
                yOffset = margins.top;
              }
            }
          });

          yOffset += 5;

          doc.setFontSize(11);
          doc.setFont('Arial', 'normal');
          if (project.totalDefects==1)
          {
            doc.text(`Total: ${project.totalDefects} Defect in ${project.projectName}`, margins.left+140, yOffset);
            yOffset += 5;
          }
          else {
            doc.text(`Total: ${project.totalDefects} Defects in ${project.projectName}`, margins.left+130, yOffset);
            yOffset += 5;
          }
  
          yOffset += 5;
        });
  
        doc.save(`DefectsReport_${date}_${time}.pdf`);
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Report exported successfully', key: 'bc' });
      },
      reject: () => {
        this.messageService.add({ severity: 'info', summary: 'Cancelled', detail: 'Export cancelled', key: 'bc' });
      }
    });
  }

  clearFilter(): void {
    this.selectedProject = null;
    this.isFilterApplied = false;
    this.getDefectsReport();
  }

  applyFilter(): void {
    const projectId = this.selectedProject ? this.selectedProject.projectId : undefined;
    this.isFilterApplied = !!projectId;
    this.getDefectsReport(projectId);
  }

  filterProjects(event: any): void {
    const query = event.query;
    this.defectsReportService.searchProjects(query).subscribe(
      (projects: any[]) => {
        this.projects = projects;
      },
      error => console.error(error)
    );
  }

  handlePageEvent(page: number): void {
    this.page = page;
  }
}