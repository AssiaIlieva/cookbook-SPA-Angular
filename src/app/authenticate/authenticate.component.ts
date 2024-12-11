import { Component, inject, OnInit, signal } from '@angular/core';
import { AuthApiService } from '../auth/auth-api.service';
import { LoaderComponent } from '../shared/loader/loader.component';

@Component({
  selector: 'app-authenticate',
  standalone: true,
  imports: [LoaderComponent],
  templateUrl: './authenticate.component.html',
  styleUrl: './authenticate.component.css',
})
export class AuthenticateComponent implements OnInit {
  private userService = inject(AuthApiService);
  error = signal<string>('');
  isAuthenticating = true;

  ngOnInit(): void {
    this.userService.user$.subscribe({
      next: (user) => {
        this.isAuthenticating = false;
      },
      error: (error: Error) => {
        this.isAuthenticating = false;
        console.error('Error fetching user:', error);
      },
      complete: () => {
        this.isAuthenticating = false;
      },
    });
  }
}
