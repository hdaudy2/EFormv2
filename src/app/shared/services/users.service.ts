import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { UserModel } from '@model/userModel.interface';

const API_URL = "http://localhost:3000";

@Injectable({
  providedIn: 'root',
})
export class UserService {
  endpoint = `${API_URL}/users`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<UserModel[]> {
    const URL = this.endpoint;
    return this.http.get<UserModel[]>(URL);
  }

  insert(body: UserModel) {
    const URL = this.endpoint;
    return this.http.post<UserModel>(URL, body);
  }

  getById(id: number): Observable<UserModel> {
    const URL = `${this.endpoint}/${id}`;
    return this.http.get<UserModel>(URL);
  }

  updateById(id: number, body: UserModel) {
    const URL = `${this.endpoint}/${id}`;
    return this.http.patch(URL, body);
  }

  auth(email: string, password: string) {
    const URL = `${this.endpoint}?email=${email}&password=${password}`;

    return this.http.get<UserModel[]>(URL);
  }
}
