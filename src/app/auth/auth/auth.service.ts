import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Router } from "@angular/router";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Subject, catchError, tap, throwError } from "rxjs";

import { User } from "../user.model";
import { environment } from "src/environments/environment";

export interface AuthResponseData {
  kind?: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable({providedIn : "root"})
export class AuthService{
  constructor(private http : HttpClient,
              private router: Router) {}

  userSubject = new BehaviorSubject<any>(null);
  private tokenExpirationTimer: any;

  signUp(email: string, password: string){
    return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + environment.firebaseAPIkey,
    {
      email: email ,
      password: password,
      returnSecureToken: true
    })
    .pipe(catchError(this.handleError),
      tap(resData => {
        this.handleAuthentication(resData.email, resData.localId, resData.idToken, +resData.expiresIn)
      })

    );
  }


  login(email: string, password: string){
    return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key='  + environment.firebaseAPIkey,
    {
      email: email,
      password: password,
      returnSecureToken: true
    })
    .pipe(catchError(this.handleError),
    tap(resData => {
      this.handleAuthentication(resData.email, resData.localId, resData.idToken, +resData.expiresIn)
    }));
  }


  autoLogin(){
    const userData : {
      email: string,
      id: string,
      _token: string,
      _tokenExpirationDate: string
    } = JSON.parse(localStorage.getItem('userData') || '{}');
    if (!userData){
      return;
    }

    const loadedUser = new User(userData.email, userData.id, userData._token, new Date(userData._tokenExpirationDate))

    if (loadedUser.token){
      this.userSubject.next(loadedUser)
      const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
      this.autoLogout(expirationDuration)
    }
  }

  logout(){
    this.userSubject.next(null)
    this.router.navigate(['/auth'])
    localStorage.removeItem('userData');
    if(this.tokenExpirationTimer){
      clearTimeout(this.tokenExpirationTimer)
    }
    this.tokenExpirationTimer = null;
  }

  autoLogout(expirationDuration: number){
    this.tokenExpirationTimer = setTimeout(()=>{
      this.logout()
    }, expirationDuration)
  }

  private handleError(err: HttpErrorResponse){
    let errorMessage = "Unknown Error Occurred";

        if(!err.error || !err.error.error){
          return throwError(errorMessage)
        }
        switch(err.error.error.message){
          case 'EMAIL_EXISTS':
            errorMessage = 'This email already exists'
            break;
          case 'EMAIL_NOT_FOUND':
            errorMessage = "This email doesn't exist"
            break;
          case 'INVALID_PASSWORD':
            errorMessage = "Incorrect Password. Try again"
            break;
        }

        return throwError(errorMessage);
  }


  private handleAuthentication(email: string, userId: string, token: string, expiresIn: number){
    const expirationDate = new Date(new Date().getTime() + (expiresIn*1000))
    const userData = new User(email, userId, token, expirationDate);
    this.userSubject.next(userData)
    this.autoLogout(expiresIn*1000);
    localStorage.setItem('userData', JSON.stringify(userData))
  }
}
