import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TestScript } from '../../models/testscript/testscripts';
import { TestScriptAssignment } from '../../models/testscript/testscriptassignment';
import { TestStep } from '../../models/testscript/teststeps';
import { StepResult } from '../../models/testscript/stepresults';
import { DefectsResolvedDto } from '../../models/defects-resolved-dto';
import { environment } from '../../../environments/environment.development';


@Injectable({
  providedIn: 'root'
})
export class TestScriptsServices {
    private apiUrl = `${environment.baseUrl}/TestScript`;

    //private apiUrl = 'https://localhost:7089';

    private httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
  
    constructor(private http: HttpClient) { }
  
    createTestScript(newTs: TestScript): Observable<TestScript> {
      return this.http.post(`${this.apiUrl}/CreateTestScript`, newTs, this.httpOptions);
    }
    // createTestScripts(templateId: string, projectId: string, process: string): Observable<TestScript> {
    //   const newTestScript = { templateId, projectId, process };
    //   return this.http.post(`${this.apiUrl}/api/TestScript/CreateTestScripts`, newTestScript, this.httpOptions);
    // }
   
  
    getAllScripts(): Observable<TestScript[]> {
      return this.http.get<TestScript[]>(`${this.apiUrl}/GetAllScripts`);
    }
    getAllResults(): Observable<StepResult[]> {
      return this.http.get<StepResult[]>(`${this.apiUrl}/GetAllResults`);
    }

    getProjectScripts(projectId: string): Observable<TestScript[]> {
      return this.http.get<TestScript[]>(`${this.apiUrl}/GetProjectScripts?projectId=${projectId}`);
    }
    getAProjectScripts(projectId: string): Observable<TestScript[]> {
      return this.http.get<TestScript[]>(`${this.apiUrl}/GetArchivedProjectScripts?projectId=${projectId}`);
    }
  
    getTestScript(scriptId: string): Observable<TestScript> {
      return this.http.get(`${this.apiUrl}/GetTestScript/${scriptId}`, this.httpOptions);
    }
    getTestScriptAssignment(scriptId: string): Observable<TestScriptAssignment> {
      return this.http.get(`${this.apiUrl}/GetTestScriptAssignment/${scriptId}`, this.httpOptions);
    }
    archiveTestScript(testScriptId: string): Observable<TestScript> {
      return this.http.put(`${this.apiUrl}/ArchiveTestScript?testScriptId=${testScriptId}`, null, this.httpOptions);
    }
    unarchiveTestScript(testScriptId: string): Observable<TestScript> {
      return this.http.put(`${this.apiUrl}/UnarchiveTestScript?testScriptId=${testScriptId}`, null, this.httpOptions);
    }
    updateTestScript(testScriptId: string, tsUpdate: any): Observable<TestScript> {
      return this.http.put(`${this.apiUrl}/UpdateTestScript?testScriptId=${testScriptId}`, tsUpdate, this.httpOptions);
    }
  
    evaluateFeedback(testScriptId: string): Observable<TestScript> {
      return this.http.put(`${this.apiUrl}/EvaluateFeedback?testScriptId=${testScriptId}`, null, this.httpOptions);
    }
    recreateTestScript(testScriptId: string): Observable<TestScript> {
      return this.http.put(`${this.apiUrl}/RecreateTestScript?testScriptId=${testScriptId}`, null, this.httpOptions);
    }
    checkToSubmit(testScriptId: string): Observable<TestScript> {
      return this.http.get(`${this.apiUrl}/CheckToSubmit/${testScriptId}`, this.httpOptions);
    }
    // Method to assign a test script
  assignTestScript(userAssignId: string, testScriptAssignId: string, teamAssignedId: string): Observable<TestScriptAssignment> {
    const url = `${this.apiUrl}/AssignTestScript`;
    const body = {
      userAssignId,
      testScriptAssignId,
      teamAssignedId
    };

    return this.http.post<TestScriptAssignment>(url, body, this.httpOptions);
  }
assign(userId: string, tsId: string, teamId: string): Observable<TestScriptAssignment> {
    const url = `${this.apiUrl}/AssignTestScript?userAssignId=${userId}&testScriptAssignId=${tsId}&teamAssignedId=${teamId}`;
    return this.http.post<TestScriptAssignment>(url, this.httpOptions);
  }
  // createTestStep(testStep: TestStep, testScriptID: string): Observable<TestStep> {
    //   return this.http.post(`${this.apiUrl}/CreateTestStep?testScriptID=${testScriptID}`, testStep, this.httpOptions);
    // }

    createTestStep(testStep: TestStep, testScriptID: string): Observable<TestStep> {
      return this.http.post(`${this.apiUrl}/CreateTestStep/${testScriptID}`, testStep, this.httpOptions);
    }
  
    getAllSteps(scriptId: string): Observable<TestStep[]> {
      return this.http.get<TestStep[]>(`${this.apiUrl}/GetAllSteps?scriptId=${scriptId}`, this.httpOptions);
    }
  
    getTestStep(stepId: string): Observable<TestStep> {
      return this.http.get(`${this.apiUrl}/GetTestStep/${stepId}`, this.httpOptions);
    }
    getStepResult(resultId: number): Observable<StepResult> {
      return this.http.get(`${this.apiUrl}/GetStepResult/${resultId}`, this.httpOptions);
    }
  
    updateTestStep(testStepId: string, tsUpdate: TestStep): Observable<TestStep> {
      return this.http.put(`${this.apiUrl}/UpdateTestStep?testStepId=${testStepId}`, tsUpdate, this.httpOptions);
    }
  
    changeStepResult(stepResultId: number, testStepId: string): Observable<TestStep> {
      return this.http.put(`${this.apiUrl}/ChangeStepResult?stepResultId=${stepResultId}&testStepId=${testStepId}`, null, this.httpOptions);
    }
  
    removeTestStep(stepId: string): Observable<TestStep> {
      return this.http.delete(`${this.apiUrl}/RemoveTestStep?stepId=${stepId}`, this.httpOptions);
    }
  
    changePhase(projectId: string): Observable<any> {
      return this.http.put(`${this.apiUrl}/ChangePhase?projectId=${projectId}`, null, this.httpOptions);
    }
  
    signOff(projectId: string, signature: string): Observable<any> {
      return this.http.put(`${this.apiUrl}/SignOff?projectId=${projectId}&signature=${signature}`, null, this.httpOptions);
    }
    sendSignOffEmail(projectId: string, formData: FormData): Observable<any> {
      const url = `${this.apiUrl}/SendSignOffEmail?projectId=${projectId}`;
      return this.http.put(url, formData); 
    }

    checkDefectsResolvedReady(testScriptId: string): Observable<DefectsResolvedDto> {
      return this.http.get<DefectsResolvedDto>(
        `${this.apiUrl}/CheckDefectsResolvedReady?testScriptId=${testScriptId}`
      );
    }
    
  }