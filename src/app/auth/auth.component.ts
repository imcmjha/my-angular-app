import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService, AUTH_ERRORS, AuthResponseData } from '../shared/services/auth.service';
import { Observable } from 'rxjs';
import { User } from '../shared/user.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {
  isLoginMode:boolean = true;
  isLoading: boolean = false;
  error: string = null;
  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
  }

  onSwitch() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(authForm: NgForm) {
    if (!authForm.valid) {
      return;
    }

    this.isLoading = true;
    this.error = null;

    let authObservable: Observable<AuthResponseData>;

    if (this.isLoginMode) {
      authObservable = this.authService.login(authForm.value);
    } else {
      authObservable = this.authService.signUp(authForm.value);
    }

    authObservable.subscribe(
      response => {
        console.log(response);
        this.isLoading = false;
        this.router.navigate(['/recipes']);
      },
      error => {
        this.error = error;
        this.isLoading = false;
      }
    );

    authForm.reset();
  }
}
