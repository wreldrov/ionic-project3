import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AuthService} from '../../services/auth.service';
import {LoadingController} from '@ionic/angular';
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
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  user: Iuser;

  constructor(
      private http: HttpClient,
      private auth: AuthService,
      private loadingController: LoadingController,
      private datePipe: DatePipe,
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
        loading.dismiss();
      });
    });
  }

  getDateString(date: string) {
    return this.datePipe.transform(new Date(date), 'MMM d yy');
  }
}
