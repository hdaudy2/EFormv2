import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { MailModel } from '@model/mailModel.interface';

const API_URL = "http://localhost:8080";

@Injectable({
  providedIn: 'root',
})
export class MailService {
  endpoint = `${API_URL}/api/mail`;

  constructor(private http: HttpClient) { }

  sendMail(body: MailModel) {
    const URL = `${this.endpoint}`;
    console.log(URL);
    return this.http.post<any>(URL, body);
  }

  createAndSendPdfMail(body: MailModel) {
    const URL = `${this.endpoint}/pdf`;
    console.log(URL);
    return this.http.post<any>(URL, body);
  }
}
