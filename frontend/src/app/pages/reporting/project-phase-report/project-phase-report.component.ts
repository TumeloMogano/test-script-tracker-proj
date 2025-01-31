import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { ReportService } from '../../../services/report/report.service';
import { Chart } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import 'jspdf-autotable';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AuthService } from '../../../services/auth/auth.service';
import { AuthUser } from '../../../models/auth/auth.model';
import { Observable } from 'rxjs';

interface ProjectReport {
  projectPhase: string;
  count: number;
  projects: string[];
}

@Component({
  selector: 'app-project-phase-report',
  templateUrl: './project-phase-report.component.html',
  styleUrls: ['./project-phase-report.component.scss']
})
export class ProjectPhaseReportComponent implements OnInit, AfterViewInit {
  @ViewChild('projectPhaseChart', { static: true }) chartRef!: ElementRef;
  reportData: ProjectReport[] = [];
  chart: any;
  totalProjects: number = 0;
  user$: Observable<AuthUser | null>;
  loggedInUser: AuthUser | null = null;

  constructor(
    private reportService: ReportService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private authService: AuthService
  ) {
    this.user$ = this.authService.userDetails$;
  }

  ngOnInit(): void {
    this.fetchReportData();
    this.authService.userDetails$.subscribe(user => {
      this.loggedInUser = user;
    });
  }

  ngAfterViewInit(): void {
    if (this.reportData.length > 0) {
      this.generateChart();
    }
  }

  fetchReportData(): void {
    this.reportService.getProjectPhaseReport().subscribe((data: ProjectReport[]) => {
      this.reportData = data;
      this.totalProjects = this.calculateTotalProjects();
      if (this.chartRef) {
        this.generateChart();
      }
    }, error => {
      console.error('Error fetching report data', error);
    });
  }

  calculateTotalProjects(): number {
    return this.reportData.reduce((sum, report) => sum + report.count, 0);
  }

  generateChart(): void {
    if (!this.chartRef) {
        console.error('Chart reference is not available.');
        return;
    }

    if (this.chart) {
        this.chart.destroy();
    }

    const chartCanvas = this.chartRef.nativeElement as HTMLCanvasElement;
    const chartSize = 300; 
    chartCanvas.width = chartSize;
    chartCanvas.height = chartSize;

    const labels = this.reportData.map(d => d.projectPhase);
    const data = this.reportData.map(d => d.count);

    this.chart = new Chart(chartCanvas, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: ['#0380bb', '#00b050', '#fae200', '#ff9300']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false, 
            plugins: {
                title: {
                    display: true,
                    text: 'Project Phase Report'
                },
                datalabels: {
                    formatter: (value, ctx) => {
                        let sum = 0;
                        const dataArr = ctx.chart.data.datasets[0].data;
                        dataArr.forEach((data: any) => {
                            sum += data;
                        });
                        const percentage = (value * 100 / sum).toFixed(2) + "%";
                        return percentage;
                    },
                    color: '#fff',
                    labels: {
                        title: {
                            font: {
                                weight: 'bold'
                            }
                        }
                    }
                }
            }
        },
        plugins: [ChartDataLabels]
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

          const drawHeader = () => {
              doc.addImage(img, 'PNG', margins.left, 15, 50, 20);
              doc.setFont('Arial');
              doc.setFontSize(18);
              doc.text('EPI-USE Africa', margins.left + 60, 20);

              doc.setFontSize(10);
              doc.text(`Generated on:`, margins.left + 60, 25);
              doc.text(`Date: ${date} Time: ${time}`, 70, 30);
              doc.text(`Report generated by: ${generatedBy}`, margins.left + 60, 35);

              doc.setLineWidth(0.5);
              doc.line(margins.left, 40, pageWidth - margins.right, 40);

              doc.setFontSize(14);
              doc.setFont('Arial', 'bold');
              doc.text('Project Phase Report', margins.left, yOffset);
              yOffset += 5;
          };

          const generatedBy = this.loggedInUser ? `${this.loggedInUser.firstName} ${this.loggedInUser.surname}` : 'Unknown User';

          drawHeader();

          setTimeout(async () => {
              const chartCanvas = this.chartRef.nativeElement as HTMLCanvasElement;

              const chartImage = await html2canvas(chartCanvas, {
                  scale: 2, 
                  useCORS: true 
              }).then((canvas) => {
                  return canvas.toDataURL('image/png');
              });

              const chartWidthPx = chartCanvas.width;
              const chartHeightPx = chartCanvas.height;

              const chartWidthMM = (chartWidthPx * 25.4) / 96; 
              const chartHeightMM = (chartHeightPx * 25.4) / 96;

              const xOffset = (pageWidth - chartWidthMM) / 2; 

              doc.addImage(chartImage, 'PNG', xOffset, yOffset, chartWidthMM, chartHeightMM);
              yOffset += chartHeightMM + 5;

              doc.setFontSize(12);
              doc.setFont('Arial', 'normal');
              doc.text(`Total Number of Projects: ${this.totalProjects}`, margins.left, yOffset);
              yOffset += 5;

              this.reportData.forEach((phase, index) => {
                  if (yOffset + 40 > pageHeight - margins.bottom) {
                      doc.addPage();
                      yOffset = margins.top;

                      drawHeader();
                  }

                  doc.setFontSize(12);
                  doc.setFont('Arial', 'normal');
                  doc.text(`Projects for ${phase.projectPhase}`, margins.left, yOffset);
                  yOffset += 5;

                  const tableData = phase.projects.map((project: string) => [project]);

                  (doc as any).autoTable({
                      startY: yOffset,
                      head: [[`Phase: ${phase.projectPhase}`]],
                      body: tableData,
                      headStyles: { fillColor: [0, 24, 68] },
                      margin: { top: 10, left: margins.left, right: margins.right },
                      tableLineColor: [0, 0, 0], 
                      tableLineWidth: 0.75, 
                      didDrawPage: (data: any) => {
                          yOffset = data.cursor.y + 5; 
                      },
                      didDrawCell: (data: any) => {
                          if (data.row.index === data.table.body.length - 1) {
                              const x = data.cell.x;
                              const y = data.cell.y + data.cell.height;
                              doc.setDrawColor(0, 0, 0); 
                              doc.setLineWidth(0.75); 
                              doc.line(x, y, x + data.cell.width, y); 
                          }
                      }
                  });

                  if (yOffset + 10 > pageHeight - margins.bottom) {
                      doc.addPage();
                      yOffset = margins.top;

                      drawHeader();
                  }

                  doc.setFontSize(11);
                  doc.setFont('Arial', 'normal');
                  doc.text(`Total Projects: ${phase.count}`, pageWidth - margins.right - 40, yOffset); 
                  yOffset += 5; 
              });

              const pageCount = doc.internal.pages.length - 1; 
              for (let i = 1; i <= pageCount; i++) {
                  doc.setPage(i);
                  doc.setFontSize(10);
                  doc.setFont('Arial', 'normal');
                  doc.text('Generated from the Test Script Tracker Application', margins.left, pageHeight - 10);
                  doc.text(`Page ${i}`, pageWidth - margins.right - 10, pageHeight - 10);
              }

              doc.save(`ProjectPhaseReport_${date}_${time}.pdf`);
              this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Report exported successfully', key: 'bc' });
          }, 1000); 
      },
      reject: () => {
          this.messageService.add({ severity: 'info', summary: 'Cancelled', detail: 'Export cancelled', key: 'bc' });
      }
  });
}

}