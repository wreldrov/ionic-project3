import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';

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
  room: string;
  teacher: Iuser;
}
@Component({
  selector: 'app-lesson',
  templateUrl: './lesson.page.html',
  styleUrls: ['./lesson.page.scss'],
})
export class LessonPage implements OnInit {
  id: number;
  lesson: Ilesson;
  constructor(
      private route: ActivatedRoute,
      private auth: AuthService,
      private http: HttpClient
  ) { }

  ngOnInit() {
    this.route.params
        .subscribe((params: any) => {
          this.id = params.id;
        });
    this.getLessonData().subscribe((res: Ilesson) => {
      this.lesson = res;
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
}
