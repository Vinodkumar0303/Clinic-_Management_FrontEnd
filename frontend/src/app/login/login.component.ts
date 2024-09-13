import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  email: string = '';
  password: string = '';
  message: string = '';

  private apiUrl = 'http://127.0.0.1:5000/api/login'; 

  constructor(private http: HttpClient, private router: Router, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    console.log('Login component initialized');
  }

  onLogin() {
    this.http.post<any>(this.apiUrl, { email: this.email, password: this.password })
      .subscribe(response => {
        if (response.token) {
          localStorage.setItem('token', response.token);
          this.snackBar.open('Login successful', 'close', { duration: 3000 });
          this.router.navigate(['/dashboard']);
        } else {
          this.snackBar.open('Invalid Email or Password', 'close', { duration: 3000 });
        }
      }, error => {
        console.error('Login failed', error);
        this.snackBar.open('Login failed. Please try again.', 'close', { duration: 3000 });
      });
  }
  goToRegistration(){
    this.router.navigate(['/register']);
  }
}
