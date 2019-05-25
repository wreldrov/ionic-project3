import { Platform, AlertController } from '@ionic/angular';
import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Storage } from '@ionic/storage';
import { environment } from '../../environments/environment';
import { tap, catchError } from 'rxjs/operators';
import {BehaviorSubject, Observable} from 'rxjs';

const TOKEN_KEY = 'access_token';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  url = environment.url;
  user = null;
  token = null;
  authenticationState = new BehaviorSubject(false);

  constructor(
      private http: HttpClient,
      private helper: JwtHelperService,
      private storage: Storage,
      private plt: Platform,
      private alertController: AlertController,
  ) {
    this.plt.ready().then(() => {
      this.checkToken();
    });
  }

  checkToken() {
    console.log('check token');
    this.storage.get(TOKEN_KEY).then(token => { console.log(token); });
    this.storage.get(TOKEN_KEY).then(token => {
      if (token) {
        const decoded = this.helper.decodeToken(token);
        const isExpired = this.helper.isTokenExpired(token);

        if (!isExpired) {
          this.user = decoded;
          this.authenticationState.next(true);
        } else {
          this.storage.remove(TOKEN_KEY);
        }
      }
    });
  }

  login(credentials) {
    return this.http.post(`${this.url}/api/auth/login`, credentials)
        .pipe(
            tap(res => {
              this.token = res['token'];
              this.storage.set(TOKEN_KEY, res['token']);
              this.user = this.helper.decodeToken(res['token']);
              this.authenticationState.next(true);
            }),
            catchError(e => {
              this.showAlert(e.error.msg);
              throw new Error(e);
            })
        );
  }

  logout() {
    this.storage.remove(TOKEN_KEY).then(() => {
      this.authenticationState.next(false);
    });
  }

  getUserData() {
    let header = new HttpHeaders();
    header = header.append('Content-Type', 'application/json');
    header = header.append('Authorization', `Bearer ${this.token}`);
    return this.http.get(`${this.url}/api/auth/me`, {headers: header}).pipe(
        catchError(e => {
          const status = e.status;
          if (status === 401) {
            this.showAlert('You are not authorized for this!');
            this.logout();
          }
          throw new Error(e);
        })
    );
  }

  isAuthenticated() {
    return this.authenticationState.value;
  }

  showAlert(msg) {
    const alert = this.alertController.create({
      message: msg,
      header: 'Error',
      buttons: ['OK']
    });
    alert.then(alert => alert.present());
  }

  // buildHeaders() {
  //   const headers = new HttpHeaders({
  //     'Content-Type': 'application/json',
  //     withCredentials: 'true'
  //   });
  //
  //   return this.storage.get(TOKEN_KEY).then((user) => {
  //     if (user) {
  //       const info = JSON.parse(user);
  //       console.log(info.token);
  //       headers.append('Authorization', 'Bearer ' + info.token);
  //       return headers;
  //     }
  //   });
  // }
  //
  // get(url) {
  //   return Observable
  //       .fromPromise(this.buildHeaders())
  //       .switchMap((headers) => this.http.get(url, { headers: headers }));
  // }
}
