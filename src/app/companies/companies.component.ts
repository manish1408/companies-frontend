import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CompanyService } from '../_services/company.service';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs';
import { PHONE_BOOK } from '../constant/phone-codes';

@Component({
  selector: 'app-companies',
  templateUrl: './companies.component.html',
  styleUrl: './companies.component.scss'
})
export class CompaniesComponent implements OnInit {
  companyForm!: FormGroup;
  loading = false;
  countries = PHONE_BOOK;
  
  // Number options for dropdowns
  directorNumbers = Array.from({ length: 10 }, (_, i) => i + 1);
  shareholderNumbers = Array.from({ length: 10 }, (_, i) => i + 1);

  // Dummy company data based on the image
  companies: any[] = [];

  constructor(
    private fb: FormBuilder,
    private companyService: CompanyService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.getCompanies();
  }

  initializeForm(): void {
    this.companyForm = this.fb.group({
      jurisdiction: ['', Validators.required],
      companyName: ['', [Validators.required, Validators.minLength(2)]],
      companyAddress: ['', Validators.required],
      zip: ['', Validators.required],
      country: ['', Validators.required],
      directors: ['', Validators.required],
      shareholders: ['', Validators.required],
      companyActivities: ['', Validators.required],
      secCode: ['', Validators.required]
    });
  }

  getCompanies(): void {
    this.companyService.getCompanies().subscribe({
      next: (res) => {
        this.companies = res.data.companies || [];
      }
    });
  }
  hasError(controlName: string): boolean {
    const control = this.companyForm.get(controlName);
    return !!(control && control.invalid && control.touched);
  }

  onSubmit(): void {
    if (this.companyForm.valid) {
      this.loading = true;
      
      // Prepare the company data according to the payload structure
      const companyData = {
        jurisdiction: this.companyForm.value.jurisdiction,
        companyName: this.companyForm.value.companyName,
        companyAddress: this.companyForm.value.companyAddress,
        zip: this.companyForm.value.zip,
        country: this.companyForm.value.country,
        directors: this.companyForm.value.directors,
        shareholders: this.companyForm.value.shareholders,
        companyActivities: this.companyForm.value.companyActivities,
        secCode: this.companyForm.value.secCode
      };

      // Add to companies array instead of API call
      this.companyService.createCompany(companyData).subscribe({
        next: (res) => {
          if (res.success) {
            this.getCompanies();
            this.toastr.success('Company created successfully!');
            this.companyForm.reset();
            this.closeModal();
          } else {
            this.toastr.error(res.message || 'Something went wrong');
          }
        }
      });
      
      this.loading = false;
    } else {
      // Mark all fields as touched to show validation errors
      this.companyForm.markAllAsTouched();
      this.toastr.warning('Please fill in all required fields correctly.');
    }
  }

  closeModal(): void {
    // Close the modal using Bootstrap's modal API
    const modalElement = document.getElementById('addCompanyModal');
    if (modalElement) {
      const modal = (window as any).bootstrap.Modal.getInstance(modalElement);
      if (modal) {
        modal.hide();
      }
    }
  }
}
