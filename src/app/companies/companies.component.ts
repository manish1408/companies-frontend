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
  companies: any[] = [
    {
      _id: '1',
      companyName: 'Memecoin Limited',
      status: 'Incorporated',
      jurisdiction: 'UK',
      dateOfIncorporation: '01-01-2025',
      companyAddress: '123 London Street, London, UK',
      postCode: 'SW1A 1AA',
      companyCountry: 'UK',
      numberOfDirectors: 2,
      numberOfShareholders: 3,
      companyActivities: 'Cryptocurrency and blockchain technology services',
      companySecCode: 'SEC001',
      createdAt: '2025-01-01T00:00:00.000Z'
    },
    {
      _id: '2',
      companyName: 'Memecoin Limited',
      status: 'Incorporation Requested',
      jurisdiction: 'BVI',
      dateOfIncorporation: 'NA',
      companyAddress: '456 Tortola Road, Road Town, BVI',
      postCode: 'VG1110',
      companyCountry: 'BVI',
      numberOfDirectors: 1,
      numberOfShareholders: 2,
      companyActivities: 'Digital currency trading and investment services',
      companySecCode: 'SEC002',
      createdAt: '2025-01-15T00:00:00.000Z'
    }
  ];

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
      postCode: ['', Validators.required],
      companyCountry: ['', Validators.required],
      numberOfDirectors: ['', Validators.required],
      numberOfShareholders: ['', Validators.required],
      companyActivities: ['', Validators.required],
      companySecCode: ['', Validators.required]
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
      
      // Prepare the company data
      const companyData = {
        _id: Date.now().toString(), // Simple ID generation
        ...this.companyForm.value,
        status: 'Incorporation Requested', // Default status
        dateOfIncorporation: 'NA', // Default for new companies
        companyWebsite: '', // Default empty for now
        additionalInfo: this.companyForm.value.companyActivities,
        createdAt: new Date().toISOString()
      };

      // Add to companies array instead of API call
      this.companies.push(companyData);
      
      this.loading = false;
      this.toastr.success('Company created successfully!');
      this.companyForm.reset();
      this.closeModal();
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
