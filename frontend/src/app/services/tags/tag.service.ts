import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TagType } from '../../models/tag/tagtype.model';
import { ApplyTagReq, Tag, TagViewModel } from '../../models/tag/tag.model';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class TagService {
  private apiUrl = `${environment.baseUrl}/Tags`;

  constructor(private httpClient: HttpClient) {}

  getTagTypes(): Observable<TagType[]> {
    return this.httpClient.get<TagType[]>(`${this.apiUrl}/GetTagTypes`);
  }

  createTag(tag: TagViewModel): Observable<any> {
    return this.httpClient.post<any>(`${this.apiUrl}/CreateTag`, tag);
  }

  getTags(): Observable<Tag[]> {
    return this.httpClient.get<Tag[]>(`${this.apiUrl}/GetTags`);
  }

  getTagById(tagId: string): Observable<Tag> {
    return this.httpClient.get<Tag>(`${this.apiUrl}/GetTagById/${tagId}`);
  }

  updateTag(tag: TagViewModel, tagId: string): Observable<any> {
    return this.httpClient.put<any>(`${this.apiUrl}/UpdateTag/${tagId}`, tag);
  }

  deleteTag(tagId: string): Observable<any> {
    return this.httpClient.delete(`${this.apiUrl}/DeleteTag/${tagId}`);
  }

  applyTag(request: ApplyTagReq): Observable<any> {
    return this.httpClient.post<any>(`${this.apiUrl}/ApplyTag`, request);
  }

  removeAppliedTag(request: ApplyTagReq): Observable<any> {
    return this.httpClient.delete<any>(`${this.apiUrl}/RemoveAppliedTag`, { body: request, });
  }

  getTagsByTestScript(testScriptId: string): Observable<Tag[]> {
    return this.httpClient.get<Tag[]>(`${this.apiUrl}/GetTagByTestScript/${testScriptId}`);
  }

  
}
