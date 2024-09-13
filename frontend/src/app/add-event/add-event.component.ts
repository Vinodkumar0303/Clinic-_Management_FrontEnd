import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MAT_DATE_FORMATS, DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { NativeDateAdapter } from '@angular/material/core';
import { MatSnackBar } from '@angular/material/snack-bar'; // Import MatSnackBar

// Custom Date Adapter extending NativeDateAdapter
export class CustomDateAdapter extends NativeDateAdapter {
  override format(date: Date, displayFormat: Object): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();

    // Return date in "dd/mm/yyyy" format
    return `${day}/${month}/${year}`;
  }
}

// Custom date formats
export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'dd/MM/yyyy',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-add-event',
  templateUrl: './add-event.component.html',
  styleUrls: ['./add-event.component.css'],
  providers: [
    { provide: DateAdapter, useClass: CustomDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
  ],
})
export class AddEventComponent implements OnInit {
  selectedDate!: Date;
  eventName!: string;
  isPopupVisible = false;
  isModalVisible = false;
  items: any[] = [];
  selectedEventId: string | null = null; 
  
  

  constructor(private http: HttpClient, private snackBar: MatSnackBar) {} // Inject HttpClient and MatSnackBar

  ngOnInit(): void {
    // Set the selectedDate to the current date
    this.selectedDate = new Date();
    this.getEvents();
    this.fetchUserData(); // Initialize user data on component load
  }

  handleSave() {
    const event = {event_name: this.eventName.toUpperCase()};
    const token = localStorage.getItem('token');
    
    this.http.post('http://127.0.0.1:5000/api/store-event', event, {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe(
      (response: any) => {
        console.log('Event stored successfully:', response);
        this.getEvents(); // Refresh the list after saving
        this.snackBar.open('Event saved successfully', 'Close', { duration: 3000 });
      },
      (error: any) => {
        console.error('Error storing event:', error);
      }
    );
}

getEvents() {
  const token = localStorage.getItem('token');
  
  this.http.get<any[]>('http://127.0.0.1:5000/api/get-events', {
    headers: { Authorization: `Bearer ${token}` },
  }).subscribe(
    (data: any[]) => {
      this.items = data; // Display only events for the logged-in user
      console.log('Events retrieved:', data);
    },
    (error: any) => {
      console.error('Error retrieving events:', error);
    }
  );
}

  fetchUserData() {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Unauthorized. No token found.');
      return;
    }

    // Use token to fetch user data
    this.http.get('http://127.0.0.1:5000/api/user-info', {
      headers: { Authorization: `Bearer ${token}` },
    }).subscribe(
      (userData: any) => {
        console.log('User data fetched successfully:', userData);
        this.snackBar.open('Login successful', 'Close', { duration: 3000 }); // Show success message
      },
      (error: any) => {
        console.error('Error fetching user data:', error);
      }
    );
  }
 
  
    deleteEvent(eventId: string) {
      const token = localStorage.getItem('token');
  
      this.http.delete(`http://127.0.0.1:5000/api/delete-event/${eventId}`, {
        headers: { Authorization: `Bearer ${token}` }
      }).subscribe(
        (response: any) => {
          console.log('Event deleted successfully:', response);
          this.getEvents(); // Refresh the list after deletion
          this.snackBar.open('Event deleted successfully', 'Close', { duration: 3000 });
          this.selectedEventId = null; // Clear the selected event after deletion
        },
        (error: any) => {
          console.error('Error deleting event:', error);
          this.snackBar.open('Error deleting event', 'Close', { duration: 3000 });
        }
      );
    }

    
    
    
    
  
    confirmDelete(eventId: string) {
      this.selectedEventId = eventId; // Set the event ID to confirm deletion
    }
  
    cancelDelete() {
      this.selectedEventId = null; // Reset the selected event if user cancels
    }
    togglePopup() {
      this.isPopupVisible = !this.isPopupVisible;
    }
  
    toggleModal() {
      this.isModalVisible = !this.isModalVisible;
    }


  }
  
  
  
  

