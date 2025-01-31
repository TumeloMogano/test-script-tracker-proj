import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CommentViewModel, Comment, CommentMentionVM } from '../../models/comment/comment.model';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class CommentsService {
  private apiUrl = `${environment.baseUrl}/Comments`;

  constructor(private httpClient: HttpClient) {}

  createComment(comment: CommentViewModel): Observable<any> {
    return this.httpClient.post<any>(`${this.apiUrl}/CreateComment`, comment);
  }

  getComments(): Observable<Comment[]> {
    return this.httpClient.get<Comment[]>(`${this.apiUrl}/GetComments`);
  }

  getCommentById(commentId: string): Observable<Comment> {
    return this.httpClient.get<Comment>(
      `${this.apiUrl}/GetCommentById/${commentId}`
    );
  }

  updateComment(comment: CommentViewModel, commentId: string): Observable<any> {
    return this.httpClient.put<any>(
      `${this.apiUrl}/UpdateComment/${commentId}`,
      comment
    );
  }

  deleteComment(commentId: string): Observable<any> {
    return this.httpClient.delete(`${this.apiUrl}/DeleteComment/${commentId}`);
  }

  notifyMention(commentMentions: CommentMentionVM[]): Observable<any> {
    return this.httpClient.post(`${this.apiUrl}/NotifyMention`, commentMentions, { responseType: 'text' });
  }
  
}
