import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
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
@Component({
  selector: 'app-teachers',
  templateUrl: './teachers.page.html',
  styleUrls: ['./teachers.page.scss'],
})
export class TeachersPage implements OnInit {
  teachers: Iuser[];
  name: string;

  constructor(
      private auth: AuthService,
      private http: HttpClient,
      private loadingController: LoadingController
  ) {
    this.getData();
  }

  ngOnInit() {
  }

  async getData() {
    const loading = await this.loadingController.create({
      spinner: 'lines',
      message: 'Please wait...',
      translucent: false,
      cssClass: 'custom-class custom-loading'
    });
    return await loading.present().then(() => {
      this.filterTeachersData();
      loading.dismiss();
    });
  }

  filterTeachersData() {
    let filter = '?filter[role_id]=2';
    if (this.name != null && this.name != '') {
      filter += `&filter[name]=${this.name}`;
    }
    this.getTeachersData(filter).subscribe((res: Iuser[]) => {
      this.teachers = res;
    });
  }

  getTeachersData(filter) {
    let header = new HttpHeaders();
    header = header.append('Content-Type', 'application/json');
    header = header.append('Authorization', `Bearer ${this.auth.token}`);
    return this.http.get(`${this.auth.url}/api/igra/user${filter}`, {headers: header}).pipe(
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
