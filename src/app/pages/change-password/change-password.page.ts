import { Component, OnInit } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {AuthService} from '../../services/auth.service';
import {LoadingController} from '@ionic/angular';
import {DatePipe} from '@angular/common';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {catchError, map} from 'rxjs/operators';

interface Iuser {
  id: number;
  role: Irole;
}
interface Irole {
  id: number;
  name: string;
}
@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.page.html',
  styleUrls: ['./change-password.page.scss'],
})
export class ChangePasswordPage implements OnInit {
  formGroup: FormGroup;
  user: Iuser;
  oldPasswordValid: boolean;
  passwordConfirmation: boolean;

  constructor(
      private http: HttpClient,
      private auth: AuthService,
      private loadingController: LoadingController,
      private datePipe: DatePipe,
      private formBuilder: FormBuilder,
      private router: Router
  ) {
    this.oldPasswordValid = true;
    this.passwordConfirmation = true;
    this.getData();
  }

  ngOnInit() {
    this.formGroup = this.formBuilder.group({
      old_password: ['', [Validators.required]],
      password: ['', [Validators.required]],
      password_confirmation: ['', [Validators.required]],
    });
  }

  async getData() {
    const loading = await this.loadingController.create({
      spinner: 'bubbles',
      message: 'Please wait...',
      translucent: true,
      cssClass: 'custom-class custom-loading'
    });
    return await loading.present().then(() => {
      this.auth.authUser.subscribe((res: Iuser) => {
        this.user = res;
        loading.dismiss();
      });
    });
  }

  onSubmit() {
    this.updateUserData().subscribe();
  }

  updateUserData() {
    let header = new HttpHeaders();
    header = header.append('Content-Type', 'application/json');
    header = header.append('Authorization', `Bearer ${this.auth.token}`);
    return this.http.post(`${this.auth.url}/api/auth/change-password/${this.user.id}`, this.formGroup.value, {headers: header}).pipe(
        map((res: any) => {
          if (this.user.role.id === 2) {
            this.router.navigateByUrl('/teacher');
          } else if (this.user.role.id === 3) {
            this.router.navigateByUrl('/student');
          }
        }),
        catchError(e => {
          const status = e.status;
          if (status === 422) {
            if (Object.prototype.hasOwnProperty.call(e.error.errors, 'password')) {
              this.passwordConfirmation = false;
            }
            if (Object.prototype.hasOwnProperty.call(e.error.errors, 'old_password')) {
              this.oldPasswordValid = false;
            }
          }
          throw new Error(e);
        })
    );
  }
}
