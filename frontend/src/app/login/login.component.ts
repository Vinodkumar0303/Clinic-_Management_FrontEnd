import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  message: string = '';
  private apiUrl = 'http://127.0.0.1:5000/api/login';

  constructor(private http: HttpClient, private router: Router) { }

  onLogin() {
    this.http.post<any>(this.apiUrl, { email: this.email, password: this.password })
      .pipe(
        catchError(error => {
          console.error('Login failed', error);
          this.message = 'Login failed. Please try again.';
          return of({ error: 'Login failed' });
        })
      )
      .subscribe(response => {
        if (response.error) {
          // Handle login failure
          console.error('Login error:', response.error);
          this.message = 'Login failed. Please check your credentials.';
        } else {
          // Handle successful login
          console.log('Login successful', response);
          const userId = response._id;
          console.log('User ID:', userId);
          // Navigate to another page or show a success message
          this.message = 'Login successful!';
          this.router.navigate(['/dashboard']); // Adjust the route as needed
        }
      });
  }

  goToRegistration() {
    this.router.navigate(['/register']);
  }
}
