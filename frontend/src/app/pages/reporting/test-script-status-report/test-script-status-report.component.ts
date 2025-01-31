import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { ReportService } from '../../../services/report/report.service';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { AutoComplete } from 'primeng/autocomplete';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AuthUser } from '../../../models/auth/auth.model';
import { AuthService } from '../../../services/auth/auth.service';
import { Observable } from 'rxjs';
import ChartDataLabels from 'chartjs-plugin-datalabels';

Chart.register(...registerables, ChartDataLabels);

interface Project {
  projectId: string;
  projectName: string;
}

interface Phase {
  phaseId: number;
  phaseName: string;
  phaseDescription: string;
  projects: Project[];
}

interface TestScriptStatus {
  testScriptStatus: string;
  count: number;
}

interface TestScriptStatusPhase {
  status: string;
  phase: string;
  count: number;
}

@Component({
  selector: 'app-test-script-status-report',
  templateUrl: './test-script-status-report.component.html',
  styleUrls: ['./test-script-status-report.component.scss']
})
export class TestScriptStatusReportComponent implements OnInit, AfterViewInit {
  user$: Observable<AuthUser | null>;
  loggedInUser: AuthUser | null = null;
  filterApplied: boolean = false; 
  reportType: string = 'status';
  projects: Project[] = [];
  phases: Phase[] = [];
  filteredProjects: Project[] = [];
  filteredPhases: Phase[] = [];
  selectedProject: Project | undefined;
  selectedPhase: Phase | undefined;
  statusReport: TestScriptStatus[] = [];
  phaseReport: TestScriptStatusPhase[] = [];
  sortedStatusReport: TestScriptStatus[] = [];
  sortedPhaseReport: TestScriptStatusPhase[] = [];
  totalTestScripts: number = 0;
  totalStatusCounts: { [key: string]: number } = {};
  totalPhaseCounts: { [key: string]: { [status: string]: number, total: number } } = {};
  pieChart: Chart<'pie'> | undefined;
  multiSeriesPieChart: Chart<'pie'> | undefined;
  //selectedButton: string = 'button1';
  sortOrder = {
    key: '',
    ascending: true
  };
  objectKeys = Object.keys;

  @ViewChild('pieChartContainer') pieChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('multiSeriesPieChartContainer') multiSeriesPieChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('autoComplete') autoComplete!: AutoComplete;

  constructor(
    private reportService: ReportService,
    private cdRef: ChangeDetectorRef,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private authService: AuthService
  ) { 
    this.user$ = this.authService.userDetails$;
  }

  ngOnInit() {
    this.fetchProjects();
    this.fetchPhases();
    this.authService.userDetails$.subscribe(user => {
      this.loggedInUser = user;
    });
  }

  ngAfterViewInit() {
    this.fetchReport();
    this.authService.userDetails$.subscribe(user => {
      this.loggedInUser = user;
    });
  }

  setReportType(type: string) {
    if (this.reportType !== type) {
      this.reportType = type;
      this.selectedProject = undefined;
      this.selectedPhase = undefined;
      this.fetchReport();
    }
  }

  fetchProjects() {
    this.reportService.getProjects().subscribe((data: Project[]) => {
      this.projects = data;
      this.filteredProjects = data;
    });
  }

  fetchPhases() {
    this.reportService.getPhases().subscribe((data: Phase[]) => {
      this.phases = data;
      this.filteredPhases = data;
    });
  }

  filterProjects(event: any) {
    const query = event.query.toLowerCase();
    this.filteredProjects = this.projects.filter(project => project.projectName.toLowerCase().includes(query));
  }

  filterPhases(event: any) {
    const query = event.query.toLowerCase();
    this.filteredPhases = this.phases.filter(phase => phase.phaseName.toLowerCase().includes(query));
  }

  applyFilter() {
    this.filterApplied = true;
    this.fetchReport();
  }

  fetchReport() {
    if (this.reportType === 'status') {
      const selectedProjectId = this.selectedProject ? this.selectedProject.projectId : undefined;
      this.reportService.getTestScriptStatusReport(selectedProjectId).subscribe((data: { testScriptStatusReport: TestScriptStatus[] }) => {
        this.statusReport = data.testScriptStatusReport;
        this.sortedStatusReport = [...this.statusReport];
        this.calculateTotals();
        this.updateCharts();
      });
    } else {
      const selectedPhaseId = this.selectedPhase ? this.selectedPhase.phaseId : undefined;
      this.reportService.getTestScriptStatusWithPhasesReport(selectedPhaseId).subscribe((data: { phaseNames: string[], tsStatusPhaseReport: TestScriptStatusPhase[] }) => {
        this.phaseReport = data.tsStatusPhaseReport;
        this.sortedPhaseReport = this.selectedPhase ? this.phaseReport.filter(report => report.phase === this.selectedPhase!.phaseName) : this.phaseReport;
        this.calculateTotals();
        this.updateCharts();
      });
    }
  }

  calculateTotals() {
    if (this.reportType === 'status') {
      this.totalTestScripts = this.statusReport.reduce((sum, report) => sum + report.count, 0);
      this.totalStatusCounts = this.statusReport.reduce((acc, report) => {
        acc[report.testScriptStatus] = report.count;
        return acc;
      }, {} as { [key: string]: number });
    } else {
      this.totalPhaseCounts = this.phaseReport.reduce((acc, report) => {
        if (!acc[report.phase]) {
          acc[report.phase] = { total: 0 };
        }
        if (!acc[report.phase][report.status]) {
          acc[report.phase][report.status] = 0;
        }
        acc[report.phase][report.status] += report.count;
        acc[report.phase].total += report.count;
        return acc;
      }, {} as { [key: string]: { [status: string]: number, total: number } });
    }
  }

  clearFilter() {
    if (this.reportType === 'status') {
      this.selectedProject = undefined;
    } else {
      this.selectedPhase = undefined;
    }
    this.filterApplied = false; 
    this.fetchReport();
  }

  clearCharts() {
    if (this.pieChart) {
      this.pieChart.destroy();
      this.pieChart = undefined;
    }
    if (this.multiSeriesPieChart) {
      this.multiSeriesPieChart.destroy();
      this.multiSeriesPieChart = undefined;
    }
  }

  updateCharts() {
    this.clearCharts();
    this.cdRef.detectChanges(); 

    if (this.reportType === 'status' && this.sortedStatusReport.length > 0) {
      this.generatePieChart(this.sortedStatusReport);
    } else if (this.reportType === 'phase' && this.sortedPhaseReport.length > 0) {
      this.generateMultiSeriesPieChart(this.sortedPhaseReport);
    }

    this.cdRef.detectChanges();
  }

  generatePieChart(data: TestScriptStatus[]) {
    const labels = data.map(d => d.testScriptStatus);
    const counts = data.map(d => d.count);
    const total = counts.reduce((sum, count) => sum + count, 0);

    const config: ChartConfiguration<'pie'> = {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [{
          data: counts,
          backgroundColor: ['#2042b1', '#0070bf', '#0380bb', '#009193', '#00b050', '#fae200', '#ff9300', '#c00000']
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          datalabels: {
            formatter: (value: number, context: any) => {
              const percentage = ((value / total) * 100).toFixed(1);
              const statusName = labels[context.dataIndex];
              return `${statusName}: ${percentage}%`;
            },
            color: '#fff',
            font: {
              weight: 'bold' as const,
              size: 14
            }
          }
        }
      }
    };

    if (this.pieChartRef && this.pieChartRef.nativeElement) {
      this.pieChart = new Chart(this.pieChartRef.nativeElement, config);
    }
  }

  generateMultiSeriesPieChart(data: TestScriptStatusPhase[]) {
    const groupedData = data.reduce((acc: Record<string, { status: string, count: number }[]>, curr: TestScriptStatusPhase) => {
      const { status, phase, count } = curr;
      if (!acc[phase]) acc[phase] = [];
      acc[phase].push({ status, count });
      return acc;
    }, {});

    const labels = [...new Set(data.map(d => d.status))];
    const backgroundColors = ['#2042b1', '#0070bf', '#0380bb', '#009193', '#00b050', '#fae200', '#ff9300', '#c00000'];
    const borderColors = ['#00FFC0', '#FF7800', '#FF0079']; 

    const datasets = Object.keys(groupedData).map((phase, index) => {
      const total = groupedData[phase].reduce((sum, item) => sum + item.count, 0);
      return {
        label: phase,
        data: groupedData[phase].map(item => item.count),
        backgroundColor: backgroundColors.slice(0, labels.length),
        borderColor: borderColors[index], 
        borderWidth: 3,
        datalabels: {
          formatter: (value: number, context: any) => {
            const percentage = ((value / total) * 100).toFixed(1);
            const statusName = labels[context.dataIndex];
            return `${statusName}: ${percentage}%`;
          },
          color: '#fff',
          font: {
            weight: 'bold' as const,
            size: 14
          }
        }
      };
    });

    const config: ChartConfiguration<'pie'> = {
      type: 'pie',
      data: {
        labels: labels,
        datasets: datasets as any 
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          datalabels: {
            formatter: (value: number, context: any) => {
              const total = datasets[context.datasetIndex].data.reduce((sum: number, count: number) => sum + count, 0);
              const percentage = ((value / total) * 100).toFixed(1);
              const statusName = labels[context.dataIndex];
              return `${statusName}: ${percentage}%`; 
            },
            color: '#fff',
            font: {
              weight: 'bold' as const,
              size: 14
            }
          },
          legend: {
            display: true,
            labels: {
              generateLabels: (chart) => {
                return datasets.map((dataset, index) => ({
                  text: dataset.label,
                  fillStyle: dataset.borderColor, 
                  strokeStyle: dataset.borderColor,
                  lineWidth: 2,
                  hidden: false,
                  index: index
                }));
              },
              color: '#333',
              font: {
                size: 12
              }
            }
          }
        }
      }
    };

    if (this.multiSeriesPieChartRef && this.multiSeriesPieChartRef.nativeElement) {
      this.multiSeriesPieChart = new Chart(this.multiSeriesPieChartRef.nativeElement, config);
    }
  }


  setOrder(key: keyof TestScriptStatus | keyof TestScriptStatusPhase, ascending: boolean) {
    this.sortOrder = { key, ascending };
    this.sortReports();
  }

  sortReports() {
    if (this.reportType === 'status') {
      this.sortedStatusReport = [...this.statusReport].sort((a, b) => {
        const valueA = a[this.sortOrder.key as keyof TestScriptStatus];
        const valueB = b[this.sortOrder.key as keyof TestScriptStatus];
        return this.sortOrder.ascending ? (valueA > valueB ? 1 : -1) : (valueA < valueB ? 1 : -1);
      });
    } else {
      this.sortedPhaseReport = [...this.phaseReport].sort((a, b) => {
        const valueA = a[this.sortOrder.key as keyof TestScriptStatusPhase];
        const valueB = b[this.sortOrder.key as keyof TestScriptStatusPhase];
        return this.sortOrder.ascending ? (valueA > valueB ? 1 : -1) : (valueA < valueB ? 1 : -1);
      });
    }
    this.updateCharts();
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
  
        let filterText = 'No filters applied';
        if (this.reportType === 'status' && this.selectedProject) {
          filterText = `Filtered for ${this.selectedProject.projectName}`;
        } else if (this.reportType === 'phase' && this.selectedPhase) {
          filterText = `Filtered for the ${this.selectedPhase.phaseName} project phase`;
        }
  
        const img = new Image();
        img.src = 'assets/company-logo.png';
        img.onload = () => {
          doc.addImage(img, 'PNG', 10, 10, 50, 20);
  
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
          doc.text(this.reportType === 'status' ? 'Test Script Status Report' : 'Test Script Status Phase Report', 10, 45);
  
          doc.setFontSize(11);
          doc.setFont('Arial', 'normal');
          doc.text(filterText, 10, 50);
  
          setTimeout(() => {
            const chartWidth = 250 / 2.83; 
            const chartXPosition = (doc.internal.pageSize.width - chartWidth) / 2;
  
            let contentStartY = 60; 
  
            if (this.reportType === 'status' && this.pieChart) {
              const pieChartImage = this.pieChart.toBase64Image();
              doc.addImage(pieChartImage, 'PNG', chartXPosition, contentStartY, chartWidth, chartWidth);
              contentStartY += chartWidth + 10; 
            }
  
            if (this.reportType === 'phase' && this.multiSeriesPieChart) {
              const multiSeriesPieChartImage = this.multiSeriesPieChart.toBase64Image();
              doc.addImage(multiSeriesPieChartImage, 'PNG', chartXPosition, contentStartY, chartWidth, chartWidth);
              contentStartY += chartWidth + 10; 
            }
  
            if (this.reportType === 'status') {
              doc.setFontSize(12);
              doc.setFont('Arial', 'bold');
              doc.text('Test Script Status Summary', 10, contentStartY + 10);
              contentStartY += 7;
  
              doc.setFontSize(10);
              doc.setFont('Arial', 'normal');
              doc.text(`Total Number of Test Scripts: ${this.totalTestScripts}`, 10, contentStartY + 10);
              contentStartY += 7;
  
              const tableHead = [['Status', 'Number of Test Scripts per Status']];
              const tableBody = this.sortedStatusReport.map(statusReport => [
                statusReport.testScriptStatus,
                statusReport.count
              ]);
  
              (doc as any).autoTable({
                startY: contentStartY + 5,
                head: tableHead,
                body: tableBody,
                headStyles: { fillColor: [0, 24, 68] }, 
                styles: {
                  fontSize: 10, 
                  cellPadding: 2, 
                },
                margin: { top: 10 },
                didDrawPage: (data: any) => {
                  const pageSize = (doc as any).internal.pageSize;
                  const pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
                  doc.setFontSize(10);
                  doc.setFont('Arial', 'normal');                    
                  doc.text('Generated from the Test Script Tracker System', data.settings.margin.left, pageHeight - 10);
                  doc.text(`Page ${data.pageNumber}`, pageSize.width - data.settings.margin.right - 10, pageHeight - 10);
                }
              });
  
              contentStartY = (doc as any).lastAutoTable.finalY + 10; 
            }
  
            if (this.reportType === 'phase') {
              Object.keys(this.totalPhaseCounts).forEach((phase, index) => {
                const phaseTitle = `Test Script Status for Phase: ${phase}`;
                doc.setFontSize(12);
                doc.setFont('Arial', 'bold');
                doc.text(phaseTitle, 10, contentStartY + 10);
                contentStartY += 7;
  
                doc.setFontSize(10);
                doc.setFont('Arial', 'normal');
                doc.text(`Total Number of Test Scripts: ${this.totalPhaseCounts[phase].total}`, 10, contentStartY + 10);
                contentStartY += 7;
  
                const tableHead = [['Status', 'Number of Test Scripts per Status']];
                const tableBody = Object.keys(this.totalPhaseCounts[phase])
                  .filter(status => status !== 'total')
                  .map(status => [status, this.totalPhaseCounts[phase][status]]);
  
                (doc as any).autoTable({
                  startY: contentStartY + 5,
                  head: tableHead,
                  body: tableBody,
                  headStyles: { fillColor: [0, 24, 68] },
                  styles: {
                    fontSize: 10,
                    cellPadding: 2,
                  },
                  margin: { top: 10 },
                  didDrawPage: (data: any) => {
                    const pageSize = (doc as any).internal.pageSize;
                    const pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
                    doc.setFontSize(10);
                    doc.setFont('Arial', 'normal');                    
                    doc.text('Generated from the Test Script Tracker Application', data.settings.margin.left, pageHeight - 10);
                    doc.text(`Page ${data.pageNumber}`, pageSize.width - data.settings.margin.right - 10, pageHeight - 10);
                  }
                });
  
                contentStartY = (doc as any).lastAutoTable.finalY + (index === 0 ? 10 : 5); 
  
                if (contentStartY > doc.internal.pageSize.height - 30) {
                  doc.addPage(); 
                  contentStartY = 5; 
                }
              });
            }
  
            doc.save(`${this.reportType === 'status' ? 'TestScriptStatusReport' : 'TestScriptStatusPhaseReport'}_${date}_${time}.pdf`);
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Report exported successfully', key: 'bc' });
          }, 1000); 
        };
      },
      reject: () => {
        this.messageService.add({ severity: 'info', summary: 'Cancelled', detail: 'Export cancelled', key: 'bc' });
      }
    });
  }
  
}