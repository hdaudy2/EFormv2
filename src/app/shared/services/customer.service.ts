import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { CustomerModel } from '@model/CustomerModel.interface';

const API_URL = "http://localhost:3000";

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  endpoint = `${API_URL}/customers`;

  constructor(private http: HttpClient) { }

  getAll(): Observable<CustomerModel[]> {
    const URL = this.endpoint;
    return this.http.get<CustomerModel[]>(URL);
  }

  insert(body: CustomerModel) {
    const URL = this.endpoint;
    return this.http.post<CustomerModel>(URL, body);
  }

  getById(id: number): Observable<CustomerModel> {
    const URL = `${this.endpoint}/${id}`;
    return this.http.get<CustomerModel>(URL);
  }

  getByCivilID(ID: string): Observable<CustomerModel[]> {
    const URL = `${this.endpoint}?civilID=${ID}`;
    return this.http.get<CustomerModel[]>(URL);
  }

  getByAccountNo(amount: string): Observable<CustomerModel[]> {
    const URL = `${this.endpoint}?accountNo=${amount}`;
    return this.http.get<CustomerModel[]>(URL);
  }

  getByUUID(id: string): Observable<CustomerModel[]> {
    const URL = `${this.endpoint}?uuid=${id}`;
    return this.http.get<CustomerModel[]>(URL);
  }

  updateById(id: number, body: CustomerModel) {
    const URL = `${this.endpoint}/${id}`;
    return this.http.patch(URL, body);
  }

  deleteById(id: number) {
    const URL = `${this.endpoint}/${id}`;
    return this.http.delete(URL);
  }
}
