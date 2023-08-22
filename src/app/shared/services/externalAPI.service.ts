import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

const API_URL = "http://localhost:8080";

@Injectable({
  providedIn: 'root',
})
export class ExternalAPIService {
  endpoint = `${API_URL}/api/external`;

  constructor(private http: HttpClient) { }

  convertFigureToWord(figure: number) {
    const URL = `${this.endpoint}/figureToWord`;
    return this.http.post<any>(URL, { figure });
  }
}

