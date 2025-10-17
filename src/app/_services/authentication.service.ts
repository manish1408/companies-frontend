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
  onboardUser(data: any) {
    return this.http.post<any>(`${this._url}/onboard-user`, data);
  }
  onboardTemplate(data: any) {
    return this.http.post<any>(`${this._url}/onboard-template`, data);
  }
  onboardSchedule(data: any) {
    return this.http.post<any>(`${this._url}/onboard-schedule`, data);
  }
  onboardKnowledge(data: any) {
    return this.http.post<any>(`${this._url}/onboard-knowledge`, data);
  }
  onboardInstallation(data: any) {
    return this.http.post<any>(`${this._url}/onboard-installation`, data);
  }
  validateLogin(data: any) {
    return this.http.post<any>(`${this._url}/verify-otp`, data);
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
  forgotPassword(data: any) {
    return this.http.post<any>(`${this._url}/forgot-password`, data);
  }
  resetPassword(data: any) {
    return this.http.post<any>(`${this._url}/reset-password`, data);
  }

  changePassword(data: any) {
    return this.http.put<any>(`${this._url}/change-password`, data);
  }
  updateProfile(data: any) {
    return this.http.put<any>(`${this._url}/update-user-profile`, data);
  }
  saveWidgetImage(data: any) {
    return this.http.post<any>(`${this._url}/upload-widget-img`, data);
  }
  saveProfileImage(data: any) {
    return this.http.post<any>(`${this._url}/upload-profile-img`, data);
  }
  resendOtp(data: any) {
    return this.http.post<any>(`${this._url}/resend-otp`, data);
  }
  updateMeetingSchedule(data: any) {
    return this.http.put<any>(`${this._url}/update-meeting-schedule`, data);
  }


  googleSignin(data: any) {
    return this.http.post<any>(`${this._url}/google-signin`, data)
  }
 
}
