import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../_services/authentication.service';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Title } from '@angular/platform-browser';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { finalize } from 'rxjs';


@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.scss',
})
export class SigninComponent implements OnDestroy {
  loading: boolean = false;
  loginForm!: FormGroup;
  passwordType: string = 'password';
  private routerSubscription: any;
  showLoginForm: boolean = true;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private authService: AuthenticationService,
  ) {
  }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  ngOnDestroy(): void {
    // Clean up subscription when component is destroyed
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  showPassword(type: string) {
    this.passwordType = type === 'password' ? 'text' : 'password';
  }

  hasError(controlName: keyof typeof this.loginForm.controls) {
    return (
      this.loginForm.controls[controlName].invalid &&
      this.loginForm.controls[controlName].touched
    );
  }

  onSubmit(): void {
    this.loginForm.markAllAsTouched();
    if (this.loginForm.valid) {
      this.loading = true;
      const reqObj = {
        email: this.loginForm.value.email,
        password: this.loginForm.value.password,
      };
      this.authService
        .signin(reqObj)
        .pipe(finalize(() => (this.loading = false)))
        .subscribe({
          next: (res) => {
            if (res.success) {
              localStorage.setItem(
                'COMPANY-USER-TOKEN',
                res.data.token
              );
              localStorage.setItem(
                'COMPANY-USER',
                JSON.stringify(res.data.user)
              );
              this.router.navigate(['/companies']);
              this.loading = false
            } else {
              this.toastr.error(res.message || 'Something went wrong');
            }
          },
          error: (err) => {
            this.toastr.error(err.error.message || 'Something went wrong');
          }
        });
    }
  }
}
