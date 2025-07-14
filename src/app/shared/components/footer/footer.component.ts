import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <footer class="bg-white py-5 mt-auto border-top">
      <div class="container">
        <div class="row g-4">
          <div class="col-lg-4 mb-4 mb-lg-0">
            <div class="d-flex align-items-center mb-3">
              <i class="bi bi-briefcase-fill text-primary me-2" style="font-size: 1.8rem;"></i>
              <h4 class="mb-0 fw-bold" style="background: linear-gradient(135deg, var(--primary-color), var(--secondary-color)); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">JobHunt</h4>
            </div>
            <p class="text-muted mb-4 pe-lg-5">
              Connecting talented professionals with top employers. Find your dream job or the perfect candidate today.
            </p>
            <div class="social-icons mb-3">
              <a href="#" class="me-3 text-dark fs-5 social-icon">
                <i class="bi bi-facebook"></i>
              </a>
              <a href="#" class="me-3 text-dark fs-5 social-icon">
                <i class="bi bi-twitter-x"></i>
              </a>
              <a href="#" class="me-3 text-dark fs-5 social-icon">
                <i class="bi bi-linkedin"></i>
              </a>
              <a href="#" class="me-3 text-dark fs-5 social-icon">
                <i class="bi bi-instagram"></i>
              </a>
            </div>
          </div>
          
          <div class="col-lg-2 col-md-4 mb-4 mb-md-0">
            <h6 class="mb-4 fw-semibold text-uppercase text-primary">For Job Seekers</h6>
            <ul class="list-unstyled mb-0">
              <li class="mb-3">
                <a routerLink="/jobs" class="text-decoration-none text-muted d-flex align-items-center">
                  <i class="bi bi-chevron-right text-primary me-2 small"></i> Browse Jobs
                </a>
              </li>
              <li class="mb-3">
                <a routerLink="/register" class="text-decoration-none text-muted d-flex align-items-center">
                  <i class="bi bi-chevron-right text-primary me-2 small"></i> Create Account
                </a>
              </li>
              <li class="mb-3">
                <a routerLink="/job-seeker/applications" class="text-decoration-none text-muted d-flex align-items-center">
                  <i class="bi bi-chevron-right text-primary me-2 small"></i> My Applications
                </a>
              </li>
              <li class="mb-3">
                <a routerLink="/career-advice" class="text-decoration-none text-muted d-flex align-items-center">
                  <i class="bi bi-chevron-right text-primary me-2 small"></i> Career Advice
                </a>
              </li>
            </ul>
          </div>
          
          <div class="col-lg-2 col-md-4 mb-4 mb-md-0">
            <h6 class="mb-4 fw-semibold text-uppercase text-primary">For Employers</h6>
            <ul class="list-unstyled mb-0">
              <li class="mb-3">
                <a routerLink="/recruiter" class="text-decoration-none text-muted d-flex align-items-center">
                  <i class="bi bi-chevron-right text-primary me-2 small"></i> Post a Job
                </a>
              </li>
              <li class="mb-3">
                <a routerLink="/pricing" class="text-decoration-none text-muted d-flex align-items-center">
                  <i class="bi bi-chevron-right text-primary me-2 small"></i> Pricing
                </a>
              </li>
              <li class="mb-3">
                <a routerLink="/resources" class="text-decoration-none text-muted d-flex align-items-center">
                  <i class="bi bi-chevron-right text-primary me-2 small"></i> Resources
                </a>
              </li>
              <li class="mb-3">
                <a routerLink="/recruiting-solutions" class="text-decoration-none text-muted d-flex align-items-center">
                  <i class="bi bi-chevron-right text-primary me-2 small"></i> Solutions
                </a>
              </li>
            </ul>
          </div>
          
          <div class="col-lg-4 col-md-4">
            <h6 class="mb-4 fw-semibold text-uppercase text-primary">Contact Us</h6>
            <ul class="list-unstyled mb-4">
              <li class="mb-3">
                <div class="d-flex">
                  <div><i class="bi bi-geo-alt text-primary me-3 fs-5"></i></div>
                  <div>123 Innovation Park, Silicon Valley, CA 94043</div>
                </div>
              </li>
              <li class="mb-3">
                <div class="d-flex">
                  <div><i class="bi bi-envelope text-primary me-3 fs-5"></i></div>
                  <div>support&#64;jobhunt.com</div>
                </div>
              </li>
              <li class="mb-3">
                <div class="d-flex">
                  <div><i class="bi bi-telephone text-primary me-3 fs-5"></i></div>
                  <div>+1 (555) 234-5678</div>
                </div>
              </li>
            </ul>
            
            <div class="newsletter">
              <h6 class="mb-3 fw-semibold">Stay Updated</h6>
              <div class="input-group">
                <input type="email" class="form-control" placeholder="Your email">
                <button class="btn btn-primary" type="button">Subscribe</button>
              </div>
            </div>
          </div>
        </div>
        
        <hr class="my-4">
        
        <div class="row align-items-center">
          <div class="col-md-6 small">
            &copy; {{ currentYear }} JobHunt. All rights reserved.
          </div>
          <div class="col-md-6 text-md-end small">
            <a routerLink="/privacy" class="text-decoration-none text-muted me-3">Privacy Policy</a>
            <a routerLink="/terms" class="text-decoration-none text-muted me-3">Terms of Service</a>
            <a routerLink="/contact" class="text-decoration-none text-muted">Contact Us</a>
          </div>
        </div>
      </div>
    </footer>
  `,
  styles: []
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
}
