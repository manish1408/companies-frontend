import { Component } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { AuthenticationService } from '../_services/authentication.service';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs';
import { Title } from '@angular/platform-browser';
import { PHONE_BOOK } from '../constant/phone-codes';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
})
export class SignupComponent {
  loading: boolean = false;
  signupForm!: FormGroup;
  passwordType: string = 'password';
  isVideoPlaying = false;
  templateSlug:any
  selectedCountry: any=PHONE_BOOK[231];
  loadingIp: boolean = false;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private titleService: Title,
    private authService: AuthenticationService,
    private toastr: ToastrService,
  ) {
  }

  ngOnInit(): void {

    this.signupForm = this.fb.group({
      fullName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      password: [
        '',
        [Validators.required, Validators.minLength(8), this.passwordValidator],
      ],
    });
  }
  hasError(controlName: keyof typeof this.signupForm.controls) {
    return (
      this.signupForm.controls[controlName].invalid &&
      this.signupForm.controls[controlName].touched
    );
  }
  getErrorMessage(controlName: keyof typeof this.signupForm.controls) {
    if (
      this.signupForm.controls[controlName].hasError('required') &&
      this.signupForm.controls[controlName].touched
    ) {
      return 'Password is required';
    }

    if (
      this.signupForm.controls[controlName].hasError('minlength') &&
      this.signupForm.controls[controlName].touched
    ) {
      return 'Password must be at least 8 characters long';
    }
    if (
      this.signupForm.controls[controlName].hasError('passwordStrength') &&
      this.signupForm.controls[controlName].touched
    ) {
      return 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
    }

    return '';
  }
  passwordValidator(
    control: AbstractControl
  ): { [key: string]: boolean } | null {
    const password = control.value;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);

    if (hasUpperCase && hasLowerCase && hasNumber) {
      return null;
    }

    return { passwordStrength: true };
  }
  showPassword(type: string) {
    this.passwordType = type === 'password' ? 'text' : 'password';
  }

  onCountrySelected(country: any) {
    this.selectedCountry = country;
  }
  onSubmit(): void {
    this.signupForm.markAllAsTouched();
    if (this.signupForm.valid) {
      this.loading = true;
      const reqObj = {
        fullName: this.signupForm.value.fullName,
        email: this.signupForm.value.email,
        phone: this.signupForm.value.phone,
        password: this.signupForm.value.password,
        userType: "user",
      };
      this.authService.signup(reqObj)
        .pipe(finalize(() => (this.loading = false)))
        .subscribe({
          next: (res) => {
            if (res.success) {
              this.router.navigate(['/login']);
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
