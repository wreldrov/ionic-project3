import { Component, OnInit } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {AuthService} from '../../services/auth.service';
import {catchError, map} from 'rxjs/operators';
import {DatePipe} from '@angular/common';

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

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.page.html',
  styleUrls: ['./schedule.page.scss'],
})
export class SchedulePage implements OnInit {
  user: Iuser;
  date: string = new Date().toISOString();
  lessons: Ilesson[];
  todayDate: string = new Date().toISOString();
  lessonTime: number;

  constructor(
      private http: HttpClient,
      private auth: AuthService,
      private datePipe: DatePipe
  ) {
    this.auth.authUser.subscribe((res: Iuser) => {
      this.user = res;
    });
    this.getLessonTime().subscribe(res => {
      this.lessonTime = res;
    });
    this.getFilteredLessons();
  }

  ngOnInit() {
  }

  getFilteredLessons() {
    const date = new Date(this.date).toISOString().split('T')[0];
    const filter = `?filter[lesson_date]=${date}`;
    return this.getLessons(filter).subscribe((res: Ilesson[]) => {
      this.lessons = res;
      return this.lessons;
    });
  }

  getLessons(filter: string) {
    let header = new HttpHeaders();
    header = header.append('Content-Type', 'application/json');
    header = header.append('Authorization', `Bearer ${this.auth.token}`);
    return this.http.get(`${this.auth.url}/api/igra/lesson${filter}`, {headers: header}).pipe(
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

  getLessonTime() {
    let header = new HttpHeaders();
    header = header.append('Content-Type', 'application/json');
    header = header.append('Authorization', `Bearer ${this.auth.token}`);
    return this.http.get(`${this.auth.url}/api/igra/lesson_time`, {headers: header}).pipe(
        map((res: any) => {
          return res;
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

  getClassName(lessonTime: number) {
    if (this.date < this.todayDate || (this.date === this.todayDate && this.lessonTime > lessonTime)) {
      return 'active';
    }
    if (this.date === this.todayDate && this.lessonTime === lessonTime) {
      return 'next';
    }
    return '';
  }
}
