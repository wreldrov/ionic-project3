import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {catchError, map} from 'rxjs/operators';
import {AuthService} from '../../services/auth.service';
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
  course: Icourse;
  teachers: Iuser[];
  students: Iuser[];
}
interface Icourse {
  id: number;
  name: string;
  image: string;
  description: string;
  price: number;
}
@Component({
  selector: 'app-group',
  templateUrl: './group.page.html',
  styleUrls: ['./group.page.scss'],
})
export class GroupPage implements OnInit {
  id: number;
  group: Igroup;

  constructor(
      private route: ActivatedRoute,
      private auth: AuthService,
      private http: HttpClient,
      private loadingController: LoadingController
  ) {
  }

  ngOnInit() {
    this.getData();
  }

  async getData() {
    const loading = await this.loadingController.create({
      spinner: 'crescent',
      message: 'Please wait...',
      translucent: true,
      cssClass: 'custom-class custom-loading'
    });
    return await loading.present().then(() => {
      this.route.params
          .subscribe((params: any) => {
            this.id = params.id;
          });
      this.getGroupData().subscribe((res: Igroup) => {
        this.group = res;
      });
      loading.dismiss();
    });
  }
  getGroupData() {
    let header = new HttpHeaders();
    header = header.append('Content-Type', 'application/json');
    header = header.append('Authorization', `Bearer ${this.auth.token}`);
    return this.http.get(`${this.auth.url}/api/igra/group/${this.id}`, {headers: header}).pipe(
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
