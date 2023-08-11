import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { RemittanceModel } from '@model/RemittanceModel.interface';

const API_URL = "http://localhost:3000";

@Injectable({
  providedIn: 'root',
})
export class ApplicationsService {
  endpoint = `${API_URL}/applications`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<RemittanceModel[]> {
    const URL = this.endpoint + "?_sort=date,isNew&_order=desc,desc";
    return this.http.get<RemittanceModel[]>(URL);
  }

  validate(type, value): Observable<RemittanceModel[]> {
    const URL = `${this.endpoint}?${type}=${value}`;
    return this.http.get<RemittanceModel[]>(URL);
  }

  insert(body: RemittanceModel) {
    const URL = this.endpoint;
    return this.http.post<RemittanceModel>(URL, body);
  }

  getById(id: number): Observable<RemittanceModel> {
    const URL = `${this.endpoint}/${id}`;
    return this.http.get<RemittanceModel>(URL);
  }

  getByUUID(uuid: string): Observable<RemittanceModel[]> {
    const URL = `${this.endpoint}?uuid=${uuid}`;
    return this.http.get<RemittanceModel[]>(URL);
  }

  updateById(id: number, body: RemittanceModel) {
    const URL = `${this.endpoint}/${id}`;
    return this.http.patch(URL, body);
  }
}
