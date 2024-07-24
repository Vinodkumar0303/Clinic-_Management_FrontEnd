import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  private apiUrl = 'http://localhost:8000/api/login/';

  constructor(private http: HttpClient) { }

  onLogin() {
    this.http.post<any>(this.apiUrl, { email: this.email, password: this.password })
      .pipe(
        catchError(error => {
          console.error('Login failed', error);
          return of({ error: 'Login failed' });
        })
      )
      .subscribe(response => {
        if (response.error) {
          // Handle login failure
          console.error('Login error:', response.error);
        } else {
          // Handle successful login
          console.log('Login successful', response);
          const userId = response._id;
          console.log('User ID:', userId);
        }
      });
  }
}
