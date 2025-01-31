import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common'; 
import { DashboardService } from '../../services/dashboard/dashboard.service';
import { AuthService } from '../../services/auth/auth.service';
import { AuthUser } from '../../models/auth/auth.model';
import { Observable, interval } from 'rxjs';
import { Chart, ChartType, registerables } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { FormsModule } from '@angular/forms';
import { AutoCompleteModule } from 'primeng/autocomplete';

interface UserEvent {
  scheduleEventId: number;
  scheduleEventName: string;
  scheduleEventDate: string | Date;
  eventTimeStart: string;
  eventTimeEnd: string;
}


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    RouterOutlet, 
    CommonModule, 
    FormsModule, 
    AutoCompleteModule, 
    RouterModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  user$: Observable<AuthUser | null>;
  loggedInUser: AuthUser | null = null;
  userId: string | undefined;
  selectedProject: any = null;
  filteredProjects: any[] = [];
  teamsChart: Chart | undefined;
  projectsChart: Chart | undefined;
  testScriptsChart: Chart | undefined;
  testScriptsWithDefectsChart: Chart | undefined;
  testScriptStatusMetricsChart: Chart | undefined;
  events: any[] = [];
  notifications: any[] = [];
  viewDate: Date = new Date();
  currentTime: string = '';
  currentDate: Date = new Date();
  hasData: boolean = false;
  totalProjects: number = 0;
  totalTestscripts: number = 0;
  totalDefectTestscripts: number = 0;
  totalTeamsTestscripts: number = 0;
  totalTeams: number = 0;



  teams: any[] = [];
  projects: any[] = [];

  teamsSummary: any[] = [];
  projectsSummary: any[] = [];
  testScriptsSummary: any[] = [];
  testScriptsWithDefectsSummary: any[] = [];
  statusMetricsSummary: any = {}; 

  private readonly chartColors = ['#009193', '#00b050', '#2042b1', '#0070bf', '#0380bb', '#fae200', '#ff9300', '#c00000'];

  constructor(
    private authService: AuthService,
    private dashboardService: DashboardService
  ) {
    this.user$ = this.authService.userDetails$;
    Chart.register(...registerables);
    Chart.register(ChartDataLabels);
  }

  ngOnInit(): void {
    this.authService.userDetails$.subscribe(user => {
      this.loggedInUser = user;
      this.userId = user?.id;
      if (this.userId) {
        this.loadDashboardData(this.userId);
      }
    });

    interval(1000).subscribe(() => {
      this.currentTime = new Date().toLocaleTimeString();
    });
  }

  loadDashboardData(userId: string): void {
    this.dashboardService.getUserTeams(userId).subscribe(data => {
      console.log('Teams Data:', data); 
      this.teams = data.teams;
      this.teamsSummary = data.summary;
      this.totalTeams = this.teams.length;
      this.createTeamsChart(data.summary);
      this.checkData();
    });
  
    this.dashboardService.getUserProjects(userId).subscribe(data => {
      console.log('Projects Data:', data); 
      this.projects = data.projects;
      this.projectsSummary = data.summary;
      this.totalProjects = this.projects.length;
      this.createProjectsChart(data.summary);
      this.checkData();
    });
  
    this.dashboardService.getUserTestScripts(userId).subscribe(data => {
      console.log('Test Scripts Data:', data); 
      this.testScriptsSummary = data.summary;
      this.totalTestscripts = this.testScriptsSummary.length;
      this.createTestScriptsChart(data.summary);
      this.checkData();
    });
  
    this.dashboardService.getUserProjectTestScriptsWithDefects(userId).subscribe(data => {
      console.log('Test Scripts With Defects Data:', data);
      this.testScriptsWithDefectsSummary = data;
      // this.totalDefectTestscripts = this.testScriptsWithDefectsSummary.length;
      this.totalDefectTestscripts = data.defectMetrics.totalDefects;
      this.createTestScriptsWithDefectsChart(data);
      this.checkData();
    });
  
    this.dashboardService.getTeamTestScriptsWithStatus(userId).subscribe(data => {
      console.log('Test Script Status Metrics Data:', data); 
      this.statusMetricsSummary = data.statusMetrics;
      this.totalTeamsTestscripts = this.statusMetricsSummary.total;
      this.createTestScriptStatusMetricsChart(data.statusMetrics);
      this.checkData();
    });
  
    this.loadUserEvents(userId);
    this.loadUserNotifications(userId);
  }
  

  loadUserEvents(userId: string): void {
    this.dashboardService.getUserTeamEvents(userId).subscribe(
      (data: { events: UserEvent[] }) => { 
        this.events = data.events.map((event: UserEvent) => { 
          return {
            ...event,
            eventTimeStart: this.convertTimeToToday(event.eventTimeStart),
            eventTimeEnd: this.convertTimeToToday(event.eventTimeEnd)
          };
        });
        this.checkData(); 
      },
      error => {
        this.events = [];
        this.checkData();
      }
    );
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.createTeamsChart(this.teamsSummary);
      this.createProjectsChart(this.projectsSummary);
      this.createTestScriptsChart(this.testScriptsSummary);
      this.createTestScriptsWithDefectsChart(this.testScriptsWithDefectsSummary);
      this.createTestScriptStatusMetricsChart(this.statusMetricsSummary);
    }, 1000); // You can adjust the delay as needed.
  }
  
  
  
  convertTimeToToday(time: string): Date {
    const today = new Date();
    const [hours, minutes, seconds] = time.split(':').map(Number);
    return new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      hours,
      minutes,
      seconds
    );
  }
  
  
  

  loadUserNotifications(userId: string): void {
    this.dashboardService.getUserNotifications(userId).subscribe(data => {
      this.notifications = data.notifications;
    }, error => {
      this.notifications = []; 
      this.checkData();
    });
  }

  loadTestScriptStatusMetrics(): void {
    const projectId = this.selectedProject ? this.selectedProject.projectId : null;
    this.dashboardService.getTeamTestScriptsWithStatus(this.userId!, projectId)
      .subscribe(data => {
        this.createTestScriptStatusMetricsChart(data.statusMetrics);
        this.checkData();
      });
  }

  createTeamsChart(summary: any): void {
    if (!summary || !Array.isArray(summary)) {
      console.error('Invalid data received for Teams chart:', summary);
      return;
    }
  
    const ctx = document.getElementById('teamsChart') as HTMLCanvasElement;
    if (!ctx) {
      console.error('Teams Chart canvas not found');
      return;
    }
  
    const labels = summary.map((item: any) => item.teamName);
    const data = summary.map((item: any) => item.activeProjects);
  
    this.teamsChart = new Chart(ctx, {
      type: 'bar' as ChartType,
      data: {
        labels: labels,
        datasets: [{
          label: 'Active Projects',
          data: data,
          backgroundColor: this.chartColors,
          borderColor: this.chartColors,
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
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
  
  createProjectsChart(summary: any): void {
    console.log('Projects Summary:', summary); 
    if (!summary || !Array.isArray(summary)) {
      console.error('Invalid data received for Projects chart:', summary);
      return;
    }
  
    const labels = summary.map((item: any) => item.phaseName);
    const data = summary.map((item: any) => item.projectCount);
    const total = data.reduce((acc: number, value: number) => acc + value, 0);
  
    const ctx = document.getElementById('projectsChart') as HTMLCanvasElement;
    this.projectsChart = new Chart(ctx, {
      type: 'pie' as ChartType,
      data: {
        labels: labels,
        datasets: [{
          label: 'Projects by Phase',
          data: data,
          backgroundColor: this.chartColors,
          borderColor: this.chartColors,
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          datalabels: {
            color: '#fff',
            formatter: (value: number, ctx: any) => {
              const percentage = ((value / total) * 100).toFixed(2) + '%';
              return percentage;
            },
            font: {
              weight: 'bold' as const,
              size: 14
            }
          }
        }
      }
    });
  }

  
  createTestScriptsChart(summary: any): void {
    if (!summary || !Array.isArray(summary)) {
      console.error('Invalid data received for Test Scripts chart:', summary);
      return;
    }
  
    const labels = summary.map((item: any) => item.statusType);
    const data = summary.map((item: any) => item.testScriptCount);
  
    const ctx = document.getElementById('testScriptsChart') as HTMLCanvasElement;
    this.testScriptsChart = new Chart(ctx, {
      type: 'doughnut' as ChartType,
      data: {
        labels: labels,
        datasets: [{
          label: 'Test Scripts by Status',
          data: data,
          backgroundColor: this.chartColors,
          borderColor: this.chartColors,
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          datalabels: {
            color: '#fff',
            formatter: (value: number, ctx: any) => {
              const percentage = ((value / this.totalTestscripts) * 100).toFixed(2) + '%';
              return percentage;
            },
            font: {
              weight: 'bold' as const,
              size: 14
            }
            //formatter: (value: number) => value.toString()
          }
        }
      }
    });
  }


  createTestScriptsWithDefectsChart(data: any): void {
    const ctx = document.getElementById('testScriptsWithDefectsChart') as HTMLCanvasElement;
    if (!ctx) {
      console.error('Test Scripts with Defects Chart canvas not found');
      return;
    }
  
    const labels = data.map((item: any) => item.projectName);
    const dataset = data.map((item: any) => item.defectMetrics?.totalDefects || 0);
  
    this.testScriptsWithDefectsChart = new Chart(ctx, {
      type: 'bar' as ChartType,
      data: {
        labels: labels,
        datasets: [{
          label: 'Total Defects',
          data: dataset,
          backgroundColor: this.chartColors,
          borderColor: this.chartColors,
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
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
  

  createTestScriptStatusMetricsChart(statusMetrics: any): void {
    if (!statusMetrics) {
      console.error('No status metrics data available');
      return;
    }

    const labels = [];
    const dataset = [];

    if (statusMetrics.created > 0) {
      labels.push('Created');
      dataset.push(statusMetrics.created);
    }
    if (statusMetrics.submitted > 0) {
      labels.push('Submitted');
      dataset.push(statusMetrics.submitted);
    }
    if (statusMetrics.inProgress > 0) {
      labels.push('In Progress');
      dataset.push(statusMetrics.inProgress);
    }
    if (statusMetrics.tested > 0) {
      labels.push('Tested');
      dataset.push(statusMetrics.tested);
    }
    if (statusMetrics.passed > 0) {
      labels.push('Passed');
      dataset.push(statusMetrics.passed);
    }
    if (statusMetrics.failedWithDefects > 0) {
      labels.push('Failed with Defects');
      dataset.push(statusMetrics.failedWithDefects);
    }
    if (statusMetrics.signedOff > 0) {
      labels.push('Signed-Off');
      dataset.push(statusMetrics.signedOff);
    }
    if (statusMetrics.failed > 0) {
      labels.push('Failed');
      dataset.push(statusMetrics.failed);
    }

    if (labels.length === 0) {
      console.warn('No statuses with non-zero counts to display.');
      return;
    }

    const ctx = document.getElementById('testScriptStatusMetricsChart') as HTMLCanvasElement;
    this.testScriptStatusMetricsChart = new Chart(ctx, {
      type: 'pie' as ChartType,
      data: {
        labels: labels,
        datasets: [{
          label: 'Test Scripts by Status',
          data: dataset,
          backgroundColor: this.chartColors.slice(0, dataset.length),
          borderColor: this.chartColors.slice(0, dataset.length),
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          datalabels: {
            color: '#fff',
            //formatter: (value: number, ctx: any) => value.toString()
            formatter: (value: number, ctx: any) => {
              const percentage = ((value / this.totalTeamsTestscripts) * 100).toFixed(2) + '%';
              return percentage;
            },
            font: {
              weight: 'bold' as const,
              size: 14
            }
          }
        }
      }
    });
  }

  filterProjects(event: any): void {
    const query = event.query.toLowerCase();
    this.filteredProjects = this.projects.filter(project => project.projectName.toLowerCase().includes(query));
  }

  onProjectSelect(): void {
    this.loadTestScriptStatusMetrics();
  }

  checkData(): void {
    this.hasData = !!(this.teams.length || this.projects.length || this.events.length || this.notifications.length);
  }
  
}