import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';



@Injectable({ providedIn: 'root' })
export class CompanyService {
  private baseUrl = `${environment.APIUrl}/companies/`;

  constructor(private http: HttpClient) {}

  getCompanies(): Observable<any> {
    return this.http.get(`${this.baseUrl}`);
  }

  createCompany(company: any): Observable<any> {
    return this.http.post(`${this.baseUrl}`, company);
  }
 
} 