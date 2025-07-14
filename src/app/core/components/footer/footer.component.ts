import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  template: `
    <footer class="footer mt-auto py-3 bg-dark text-white">
      <div class="container text-center">
        <span>© 2025 Job Hunt Platform. All rights reserved.</span>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      margin-top: 20px;
    }
  `]
})
export class FooterComponent {}
