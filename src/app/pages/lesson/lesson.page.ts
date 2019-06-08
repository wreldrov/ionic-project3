import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import {DatePipe} from '@angular/common';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {LoadingController} from '@ionic/angular';

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
}
interface Irole {
  id: number;
  name: string;
}
interface Igroup {
  id: number;
  name: string;
  course_id: number;
}
interface Ilesson {
  id: number;
  name: string;
  group: Igroup;
  lesson_date: string;
  lesson_time: string;
  lesson_time_index: number;
  room: string;
  teacher: Iuser;
}
interface Iattendance {
  id: number;
  student: Iuser;
  is_exist: boolean;
}
@Component({
  selector: 'app-lesson',
  templateUrl: './lesson.page.html',
  styleUrls: ['./lesson.page.scss'],
})
export class LessonPage implements OnInit {
  id: number;
  user: Iuser;
  lesson: Ilesson;
  attendance: Iattendance[];
  formGroup: FormGroup;

  constructor(
      private route: ActivatedRoute,
      private auth: AuthService,
      private http: HttpClient,
      private datePipe: DatePipe,
      private formBuilder: FormBuilder,
      private loadingController: LoadingController
  ) {
    this.formGroup = this.formBuilder.group({});
  }

  ngOnInit() {
    this.getData();
  }

  async getData() {
    const loading = await this.loadingController.create({
      spinner: 'dots',
      message: 'Please wait...',
      translucent: true,
      cssClass: 'custom-class custom-loading'
    });
    return await loading.present().then(() => {
      this.route.params
          .subscribe((params: any) => {
            this.id = params.id;
          });
      this.auth.authUser.subscribe((res: Iuser) => {
        this.user = res;
      });
      this.getLessonData().subscribe((res: Ilesson) => {
        this.lesson = res;
      });
      this.getAttendance().subscribe((res: Iattendance[]) => {
        res.map((item: any) => {
          this.formGroup.addControl(item.student.id, new FormControl(item.is_exist));
        });
        this.attendance = res;
        loading.dismiss();
      });
    });
  }

  getLessonData() {
    let header = new HttpHeaders();
    header = header.append('Content-Type', 'application/json');
    header = header.append('Authorization', `Bearer ${this.auth.token}`);
    return this.http.get(`${this.auth.url}/api/igra/lesson/${this.id}`, {headers: header}).pipe(
        map((res: any) => {
          return res.data;
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

  getAttendance() {
    let header = new HttpHeaders();
    header = header.append('Content-Type', 'application/json');
    header = header.append('Authorization', `Bearer ${this.auth.token}`);
    return this.http.get(`${this.auth.url}/api/igra/attendance/${this.id}`, {headers: header}).pipe(
        map((res: any) => {
          return res.data;
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

  getDateString(lessonDate: string) {
    return this.datePipe.transform(new Date(lessonDate), 'MMM d');
  }

  onSubmit() {
    this.saveAttendance().subscribe();
  }

  saveAttendance() {
    let header = new HttpHeaders();
    header = header.append('Content-Type', 'application/json');
    header = header.append('Authorization', `Bearer ${this.auth.token}`);
    return this.http.put(`${this.auth.url}/api/igra/attendance/${this.id}`, this.formGroup.value, {headers: header}).pipe(
        map((res: any) => {
          return res.data;
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
