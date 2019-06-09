import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {LoadingController} from '@ionic/angular';
import {catchError, map} from 'rxjs/operators';

interface Iuser {
  id: number;
  email: string;
  surname: string;
  name: string;
}
interface Ihomework {
  id: number;
  name: string;
  file: string;
}
interface Ilesson {
  id: number;
  name: string;
  lesson_date: string;
  lesson_time: string;
  lesson_time_index: number;
  room: string;
  teacher: Iuser;
  homework: Ihomework;
  date: string;
  active: boolean;
}
@Component({
  selector: 'app-homework',
  templateUrl: './homework.page.html',
  styleUrls: ['./homework.page.scss'],
})
export class HomeworkPage implements OnInit {
  user: Iuser;
  lessons: Ilesson[];
  constructor(
      private auth: AuthService,
      private http: HttpClient,
      private loadingController: LoadingController
  ) { }

  ngOnInit() {
    this.getData();
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
      });
      this.getHomeworkData().subscribe((res: Ilesson[]) => {
        this.lessons = res;
        loading.dismiss();
      });
    });
  }

  getHomeworkData() {
    let header = new HttpHeaders();
    header = header.append('Content-Type', 'application/json');
    header = header.append('Authorization', `Bearer ${this.auth.token}`);
    return this.http.get(`${this.auth.url}/api/igra/homework`, {headers: header}).pipe(
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

  logout() {
    this.auth.logout();
  }
}
