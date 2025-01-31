import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Template, TemplateTestStep } from '../../models/template/template.model';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class TemplateService {
  private apiUrl = `${environment.baseUrl}/Template`;

  // private apiUrl = 'https://localhost:7089/api/';

  constructor(private http: HttpClient) {}

  createTemplate(template: Template): Observable<Template> {
    return this.http.post<Template>(`${this.apiUrl}/CreateTemplate`, template);
  }

  getTemplateById(templateId: string): Observable<Template> {
    return this.http.get<Template>(`${this.apiUrl}/GetTemplateById/${templateId}`);
  }

  getAllTemplates(): Observable<Template[]> {
    return this.http.get<Template[]>(`${this.apiUrl}/GetAllTemplates`);
  }

  getTemplateStatuses(): Observable<{ tempStatusId: number; tempStatusName: string }[]> {
    return this.http.get<{ tempStatusId: number; tempStatusName: string }[]>(`${this.apiUrl}/GetAllTempStatuses`);
  }

  getAllApprovedTemplates(): Observable<Template[]> {
    return this.http.get<Template[]>(`${this.apiUrl}/GetAllApprovedTemplates`);
  }

  updateTemplate(templateId: string, template: Template): Observable<Template> {
    return this.http.put<Template>(`${this.apiUrl}/UpdateTemplate/${templateId}`, template);
  }

  removeTemplate(templateId: string): Observable<Template> {
    return this.http.delete<Template>(`${this.apiUrl}/RemoveTemplate/${templateId}`);
  }

  getTemplateTestSteps(templateId: string): Observable<TemplateTestStep[]> {
    return this.http.get<TemplateTestStep[]>(`${this.apiUrl}/GetTemplateTestStepsById/${templateId}`);
  }

  addTemplateTestStep(templateId: string, testStep: TemplateTestStep): Observable<TemplateTestStep> {
    return this.http.post<TemplateTestStep>(`${this.apiUrl}/AddTemplateTestStep/${templateId}`, testStep);
  }

  updateTemplateTestStep(tempTestStepId: string, testStep: TemplateTestStep): Observable<TemplateTestStep> {
    return this.http.put<TemplateTestStep>(`${this.apiUrl}/UpdateTemplateTestStep/${tempTestStepId}`, testStep);
  }

  updateTestStepsOrder(testSteps: any[]): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/UpdateTestStepsOrder`, testSteps);
  }

  removeTemplateTestStep(tempTestStepId: string): Observable<TemplateTestStep> {
    return this.http.delete<TemplateTestStep>(`${this.apiUrl}/RemoveTemplateTestStep/${tempTestStepId}`);
  }

  submitTemplate(templateId: string, template: Template): Observable<Template> {
    return this.http.put<Template>(`${this.apiUrl}/SubmitTemplate/${templateId}`, template);
  }

  approveTemplate(templateId: string, template: Template): Observable<Template> {
    return this.http.put<Template>(`${this.apiUrl}/ApproveTemplate/${templateId}`, template);
  }

  rejectTemplate(templateId: string, template: Template): Observable<Template> {
    return this.http.put<Template>(`${this.apiUrl}/RejectTemplate/${templateId}`, template);
  }

  acknowledgeRejection(templateId: string, template: Template): Observable<Template> {
    return this.http.put<Template>(`${this.apiUrl}/AcknowledgeRejection/${templateId}`, template);
  }

  reDraftTemplate(templateId: string, template: Template): Observable<Template> {
    return this.http.put<Template>(`${this.apiUrl}/ReDraftTemplate/${templateId}`, template);
  }

  copyTemplate(templateId: string): Observable<Template> {
    return this.http.get<Template>(`${this.apiUrl}/CopyTemplate/${templateId}`);
  }
}
