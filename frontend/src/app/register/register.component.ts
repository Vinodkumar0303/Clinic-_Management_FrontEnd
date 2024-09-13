import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  message: string | null = null;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(2)]],
      confirmPassword: ['', Validators.required],
      name: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
    }, { validator: this.passwordMatchValidator });
  }

  // Custom validator to check if password and confirmPassword match
  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  register(): void {
    // Reset message
    this.message = null;
  
    // Check if form is valid
    if (this.registerForm.invalid) {
      this.message = 'Please fill in all required fields correctly.';
      this.showSnackBar(this.message, 'error');
      return;
    }
  
    // Define the backend URL
    const url = 'http://127.0.0.1:5000/api/register'; // Adjust the URL if necessary
  
    // Send HTTP POST request to the backend
    this.http.post(url, this.registerForm.value).subscribe({
      next: (response: any) => {
        this.message = response.message || 'User registered successfully!';
        console.log('Registration successful!', response);
  
        // Show success snackbar and redirect after 3 seconds
        this.showSnackBar(this.message, 'success');
        setTimeout(() => this.router.navigate(['/login']), 3000);
      },
      error: (error) => {
        this.message = error.error?.message || 'Registration failed.';
        console.error('Registration failed', error);
  
        // Show error snackbar
        this.showSnackBar(this.message, 'error');
      }
    });
  }
  
  private showSnackBar(message: string | null, type: 'success' | 'error' = 'success'): void {
    this.snackBar.open(message ?? 'An unexpected error occurred.', '', {
      duration: 3000, // 3 seconds
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: type === 'success' ? 'snack-bar-success' : 'snack-bar-error'
    });
  }
  
  

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}
