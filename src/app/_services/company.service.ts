import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';



@Injectable({ providedIn: 'root' })
export class CompanyService {
  private baseUrl = `${environment.APIUrl}/Company`;

  constructor(private http: HttpClient) {}

  getCompanies(params?: {
    page?: number;
    limit?: number;
    filter?: string;
  }): Observable<any> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(key => {
        const value = (params as any)[key];
        if (value !== undefined && value !== null && value !== '') {
          httpParams = httpParams.set(key, value);
        }
      });
    }
    return this.http.get(`${this.baseUrl}/get-all`, { params: httpParams });
  }

  createCompany(company: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/create`, company);
  }
 
} 