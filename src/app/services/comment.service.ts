import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Comment } from '../models/comment.model';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  constructor(
    private http: HttpClient
  ) { }

  initComment = () => {
    return new Comment().deserialize({
      id: 0,
      firstname: '',
      lastname: '',
      comment: '',
      note: 0,
      isApproved: false,
      garage: {}
    } as Comment)
  }

  getComments(): Observable<any> {

    return this.http.get(
      environment.useBackend + `/api/comment`
    )

  }

  getCommentByGarage(garage_id: number): Observable<any> {

    return this.http.get(
      environment.useBackend + `/api/user/garage/${garage_id}`
    )

  }

  putComment(comment: Comment): Observable<any> {

    return this.http.put(
      environment.useBackend + `/api/comment/${comment.id}`,
      comment
    )

  }

  postComment(comment: Comment): Observable<any> {

    return this.http.post(
      environment.useBackend + `/api/comment`,
      comment
    )

  }

  deleteComment(id: number): Observable<any>{

    return this.http.delete(
      environment.useBackend + `/api/comment/${id}`
    )

  }

}
