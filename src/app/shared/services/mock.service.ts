import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { UserModel } from '@model/userModel.interface';

const API_URL = "https://api.mockaroo.com";

@Injectable({
  providedIn: 'root',
})
export class MockService {
  endpoint = `${API_URL}/api/c422f360`;

  constructor(private http: HttpClient) { }

  getMockUser(count: number): Observable<UserModel[]> {
    const URL = `${this.endpoint}?count=${count}&key=af567ec0`;
    return this.http.get<UserModel[]>(URL);
  }

  convertFigureToWord(figure: number): Observable<string> {
    const URL = `figureToWord`;
    return this.http.post<string>(URL, { ubiNum: figure });
  }
}
