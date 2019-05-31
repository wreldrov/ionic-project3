import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {catchError, map} from 'rxjs/operators';
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
}
interface Icourse {
  id: number;
  name: string;
  image: string;
  description: string;
  price: number;
}

@Component({
  selector: 'app-groups',
  templateUrl: './groups.page.html',
  styleUrls: ['./groups.page.scss'],
})
export class GroupsPage implements OnInit {
  user: Iuser;
  groups: Igroup[];
  name: string;

  constructor(
      private http: HttpClient,
      private auth: AuthService,
  ) {
    this.auth.authUser.subscribe((res: Iuser) => {
      this.user = res;
    });
    this.getGroupsData('').subscribe((res: Igroup[]) => {
      this.groups = res;
    });
  }

  ngOnInit() {
  }

  filterGroupsData() {
    let filter = '';
    if (this.name !== null && this.name !== '') {
      filter = `?filter[name]=${this.name}`;
    }
    this.getGroupsData(filter).subscribe((res: Igroup[]) => {
      this.groups = res;
    });
  }

  getGroupsData(filter) {
    let header = new HttpHeaders();
    header = header.append('Content-Type', 'application/json');
    header = header.append('Authorization', `Bearer ${this.auth.token}`);
    return this.http.get(`${this.auth.url}/api/igra/groups${filter}`, {headers: header}).pipe(
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
