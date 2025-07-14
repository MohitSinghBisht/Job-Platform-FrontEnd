import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="container text-center py-5">
      <h1 class="display-1">404</h1>
      <h2 class="mb-4">Page Not Found</h2>
      <p class="lead">The page you are looking for does not exist or has been moved.</p>
      <a routerLink="/" class="btn btn-primary mt-3">Go Home</a>
    </div>
  `,
  styles: []
})
export class NotFoundComponent {}
