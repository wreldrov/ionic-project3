import { Component, OnInit } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {AuthService} from '../../services/auth.service';
import {LoadingController} from '@ionic/angular';
import {DatePipe} from '@angular/common';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {catchError, map, tap} from 'rxjs/operators';
import {Router} from '@angular/router';

interface Iuser {
  id: number;
  email: string;
  surname: string;
  name: string;
  gender: boolean;
  address: string;
  image: string;
  birthday: string;
  phone_number: string;
  role: Irole;
  parent_surname: string;
  parent_name: string;
  experience: string;
  profession: string;
  about: string;
  group: Igroup;
}
interface Igroup {
  id: number;
  name: string;
  course_id: number;
}
interface Irole {
  id: number;
  name: string;
}
@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.page.html',
  styleUrls: ['./profile-edit.page.scss'],
})
export class ProfileEditPage implements OnInit {
  formGroup: FormGroup;
  user: Iuser;
  birthday: any;

  constructor(
      private http: HttpClient,
      private auth: AuthService,
      private loadingController: LoadingController,
      private datePipe: DatePipe,
      private formBuilder: FormBuilder,
      private router: Router
  ) {
    this.getData();
  }

  ngOnInit() {
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
        this.formGroup = this.formBuilder.group({
          surname: [this.user.surname, [Validators.required]],
          name: [this.user.name, [Validators.required]],
          parent_surname: [this.user.parent_surname],
          parent_name: [this.user.parent_name],
          birthday: [this.user.birthday, [Validators.required]],
          phone_number: [this.user.phone_number],
          address: [this.user.address],
        });
        loading.dismiss();
      });
    });
  }

  onSubmit() {
    const birthday = this.formGroup.value.birthday;
    this.formGroup.value.birthday = this.datePipe.transform(birthday, 'yyyy-MM-dd');
    this.updateUserData().subscribe();
  }

  updateUserData() {
    let header = new HttpHeaders();
    header = header.append('Content-Type', 'application/json');
    header = header.append('Authorization', `Bearer ${this.auth.token}`);
    return this.http.put(`${this.auth.url}/api/igra/user/${this.user.id}`, this.formGroup.value, {headers: header}).pipe(
        map((res: any) => {
          if (this.user.role.id === 2) {
            this.router.navigateByUrl('/teacher');
          } else if (this.user.role.id === 3) {
            this.router.navigateByUrl('/student');
          }
        }),
        catchError(e => {
          const status = e.status;
          if (status === 401) {
            this.auth.showAlert('You are not authorized for this!');
            this.auth.logout();
          }
          throw new Error(e);
        })
    );
  }

}
