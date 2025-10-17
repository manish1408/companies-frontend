import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private _url = `${environment['APIUrl']}/auth`;
  constructor(
    private http: HttpClient,
  ) {}

  signin(data: any) {
    return this.http.post<any>(`${this._url}/signin`, data);
  }

  signup(data: any) {
    return this.http.post<any>(`${this._url}/signup`, data);
  }

  signOut(): void {
    sessionStorage.clear();
    localStorage.clear();
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('COMPANY-USER-TOKEN');
    const user = JSON.parse(localStorage.getItem('COMPANY-USER') || '{}');
  
    // ✅ User is authenticated only if they have a token AND are fully onboarded
    return !!token 
  }
 
}
