import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { throwError, BehaviorSubject } from 'rxjs';
import { User } from '../user.model';
import { Router } from '@angular/router';

export interface AuthResponseData {
  email: string;
  expiresIn: string;
  idToken: string;
  kind: string;
  localId: string;
  refreshToken: string;
  registered?: boolean;
}

export const AUTH_ERRORS: { [key: string]: string }[] = [
  { key: 'EMAIL_EXISTS', value: 'The email address is already in use by another account.' },
  { key: 'OPERATION_NOT_ALLOWED', value: 'Password sign-in is disabled for this project.' },
  { key: 'TOO_MANY_ATTEMPTS_TRY_LATER', value: 'We have blocked all requests from this device due to unusual activity. Try again later.' },
  { key: 'EMAIL_NOT_FOUND', value: 'There is no user record corresponding to this identifier. The user may have been deleted.' },
  { key: 'INVALID_PASSWORD', value: 'The password is invalid or the user does not have a password.' },
  { key: 'USER_DISABLED', value: 'The user account has been disabled by an administrator.' },

];

@Injectable({ providedIn: 'root' })
export class AuthService {
  public authenticatedUser = new BehaviorSubject<User>(null);
  private signUpEndPoint: string = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=';
  private loginEndPoint: string = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=';
  private key: string = 'AIzaSyBPY7Ht8RaXEkSFgT55uf5SFU3L_t75R1A';
  private authTimer: any;

  constructor(private http: HttpClient, private router: Router) { }

  public signUp(credentials: { email: string, password: string }) {
    const url = `${this.signUpEndPoint}${this.key}`;
    return this.http.post<AuthResponseData>(url, credentials)
      .pipe(catchError(this.handleError), tap(response => this.handleUser(response)));
  }

  public login(credentials: { email: string, password: string }) {
    const url = `${this.loginEndPoint}${this.key}`;
    return this.http.post<AuthResponseData>(url, {...credentials, "returnSecureToken": true})
      .pipe(catchError(this.handleError), tap(res => this.handleUser(res)));
  }

  public logout() {
    this.authenticatedUser.next(null);
    localStorage.removeItem('userData');
    this.router.navigate(['/auth']);
    if (this.authTimer) {
      clearInterval(this.authTimer);
    }
    this.authTimer = null;
  }

  public autoLogin() {
    const user: {
      email: string;
      id: string;
      _token: string;
      _tokenExpirationDate: string;
    } = JSON.parse(localStorage.getItem('userData'));
    if (!user) {
      return;
    }

    const fetchedUser = new User(user.email, user.id, user._token, new Date(user._tokenExpirationDate));

    if (fetchedUser.token) {
      this.authenticatedUser.next(fetchedUser);
      const time = new Date(user._tokenExpirationDate).getTime() - new Date().getTime();
      this.autoLogout(time);
    }
  }

  public autoLogout(expirationTime: number) {
    this.authTimer = setTimeout(() => {
      this.logout();
    }, expirationTime);
  }

  private handleUser(response: AuthResponseData) {
    const expirationDate = new Date(new Date().getTime() + +response.expiresIn);
    const user = new User(response.email, response.localId, response.idToken, expirationDate);
    this.authenticatedUser.next(user);
    this.autoLogout(+response.expiresIn * 100);
    localStorage.setItem('userData', JSON.stringify(user));
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An Error Occured';
    if (!error.error || !error.error.error) {
      return throwError(errorMessage);
    }
    console.log(error);
    const message = error.error.error.message;
    const completeMessage = AUTH_ERRORS.filter(e => e.key === message)[0].value;
    errorMessage = `${error.name}: ${completeMessage}`;
    return throwError(errorMessage);
  }
}
