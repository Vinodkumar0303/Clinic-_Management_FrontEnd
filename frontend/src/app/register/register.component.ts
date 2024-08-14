// src/app/register/register.component.ts
import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerData = { email: '', password: '' };
  message:string = '';

  constructor(private http: HttpClient,private router:Router) {}

  register() {
    const url = 'http://127.0.0.1:5000/api/register'; // Adjust the URL if necessary
    this.http.post(url, this.registerData).subscribe(
      response => {
        this.message= (response as any ).message;
        console.log('Registration successful!', response);
        // Handle successful registration response here (e.g., navigate to a different page, show a success message)
      },
      error => {
        this.message=(error.error as any ).message;
        console.error('Registration failed', error);
        // Handle registration error here (e.g., show an error message)
      }
    );
  }


  goToLogin(){
this.router.navigate(['/login']);
  }
}
