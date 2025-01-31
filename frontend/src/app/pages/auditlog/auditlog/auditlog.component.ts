import { Component, OnInit } from '@angular/core';
import { AuditLog } from '../../../models/auditlog';
import { AuditlogService } from '../../../services/auditlog/auditlog.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

@Component({
  selector: 'app-auditlog',
  templateUrl: './auditlog.component.html',
  styleUrl: './auditlog.component.scss'
})
export class AuditlogComponent implements OnInit{
  
  auditLogs: AuditLog[] = [];
  filteredAuditLogs: AuditLog[] = [];
  firstName: string = ''; 
  surname: string = ''; 
  actionName: string = ''; 
  startDate: string = '';
  endDate: string = '';
  page: number = 1;
  sortDirection: 'asc' | 'desc' = 'asc'

  constructor(private auditlogService: AuditlogService, private confirmationService: ConfirmationService, private messageService: MessageService) { }

  ngOnInit(): void {
    this.loadAuditLogs();
  }

  loadAuditLogs(): void {
    this.auditlogService.getAuditLogs().subscribe(
      logs => {
        this.auditLogs = logs;
        this.filteredAuditLogs = logs;
      },
      error => {
        console.error('Failed to load audit logs:', error);
      }
    );
  }

  filterAuditLogs(): void {
    this.auditlogService.getFilteredAuditLogs(this.firstName, this.surname, this.actionName, this.startDate, this.endDate).subscribe(
      logs => {
        this.filteredAuditLogs = logs;
      },
      error => {
        console.error('Failed to filter audit logs:', error);
      }
    );
  }

  resetFilters(): void {
    this.firstName = ''; // Reset firstName
    this.surname = ''; // Reset surname
    this.actionName = ''; // Reset actionName
    this.startDate = '';
    this.endDate = '';
    this.filteredAuditLogs = [...this.auditLogs]; // Reset to all logs
  }

  sortByTimestamp(): void {
    //sort direction between 'asc' and 'desc'
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    this.filteredAuditLogs.sort((a, b) => {
      const dateA = new Date(a.timeStamp).getTime();
      const dateB = new Date(b.timeStamp).getTime();

      if (this.sortDirection === 'asc') {
        return dateA - dateB; // Sort in ascending order
      } else {
        return dateB - dateA; // Sort in descending order
      }
    });
  }
  
  //another sizing option: 
  exportToPDF(): void {
    this.confirmationService.confirm({
      header: 'Confirmation',
      message: 'Are you sure you want to export this report?',
      accept: () => {
        const doc = new jsPDF('landscape'); // Set to landscape
        const currentTime = new Date();
        const date = currentTime.toLocaleDateString().replace(/\//g, '-');
        const time = currentTime.toLocaleTimeString().replace(/:/g, '-');

        let dateRangeText = '';
        if (this.startDate && this.endDate) {
          dateRangeText = `Date Range: ${this.startDate} to ${this.endDate}`;
        }

        const img = new Image();
        img.src = 'assets/company-logo.png';
        img.onload = () => {
          doc.addImage(img, 'PNG', 10, 10, 50, 20);

          doc.setFont('Arial');
          doc.setFontSize(18);
          doc.text('EPI-USE Africa', 70, 20);

          doc.setFontSize(10);
          doc.text(`Date: ${date} Time: ${time}`, 70, 30);

          doc.setLineWidth(0.5);
          doc.line(10, 35, 280, 35);

          if (dateRangeText) {
            doc.setFontSize(12);
            doc.text(dateRangeText, 10, 45);
          }

          doc.setFontSize(14);
          doc.setFont('Arial', 'bold');
          doc.text('Audit Logs Report', 10, 55);

          (doc as any).autoTable({
            startY: 65,
            head: [['User Name', 'Action Name', 'Timestamp', 'Table Name', 'Old Values', 'New Values', 'Affected Columns']],
            body: this.filteredAuditLogs.map(log => [
              log.userName,
              log.actionName,
              log.timeStamp,
              log.tableName,
             // log.primaryKey,
              log.oldValues ? log.oldValues.substring(0, 50) + '...' : 'N/A',
              log.newValues ? log.newValues.substring(0, 50) + '...' : 'N/A',
              log.affectedColumns ? log.affectedColumns.substring(0, 50) + '...' : 'N/A',
            ]),
            headStyles: { fillColor: [0, 24, 68] },
            columnStyles: {
              0: { cellWidth: 30 },  // User Name
              1: { cellWidth: 20 },  // Action Name
              2: { cellWidth: 20 },  // Timestamp
              3: { cellWidth: 30 },  // Table Name
             // 4: { cellWidth: 25 },  // Primary Key
              5: { cellWidth: 55 },  // Old Values
              6: { cellWidth: 55 },  // New Values
              7: { cellWidth: 40 },  // Affected Columns
            },
            didDrawPage: (data: any) => {
              const pageSize = (doc as any).internal.pageSize;
              const pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
              doc.setFontSize(10);
              doc.text('Generated from the Test Script Tracker', data.settings.margin.left, pageHeight - 10);
              doc.text(`Page ${data.pageNumber}`, pageSize.width - data.settings.margin.right - 10, pageHeight - 10);
            }
          });

          doc.save(`AuditLogsReport_${date}_${time}.pdf`);

          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Report exported successfully', key: 'bc' });
        };
      },
      reject: () => {
        this.messageService.add({ severity: 'info', summary: 'Cancelled', detail: 'Export cancelled', key: 'bc' });
      }
    });
}

}
