import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  userName: string | null = null;

  private apiUrl = 'http://127.0.0.1:5000/api/user-info';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchUserData();
  }

  fetchUserData() {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Unauthorized. No token found.');
      return;
    }

    this.http.get<{ name: string }>(this.apiUrl, {
      headers: { 'Authorization': token }
    }).subscribe(
      response => {
        this.userName = response.name;
      },
      error => {
        console.error('Error fetching user data', error);
        if (error.status === 401) {
          console.log('Unauthorized. Please log in again.');
          // Redirect to login page or show a message
        }
      }
    );
  }
}
