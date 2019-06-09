import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AuthService} from '../../services/auth.service';
import {ActionSheetController, LoadingController} from '@ionic/angular';
import {Router} from '@angular/router';
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
@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
})
export class AdminPage implements OnInit {
  user: Iuser;

  constructor(
      private http: HttpClient,
      private auth: AuthService,
      private loadingController: LoadingController,
      private actionSheet: ActionSheetController,
      private router: Router,
      private datePipe: DatePipe,
  ) {
    this.getData();
  }


  ngOnInit(): void {
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

  async presentActionSheet() {
    const actionSheet = await this.actionSheet.create({
      mode: 'ios',
      buttons: [
        {
          text: 'Отмена',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Редактировать профиль',
          role: 'destructive',
          cssClass: 'edit-profile-btn',
          handler: () => {
            this.router.navigate(['profile-edit']);
          }
        },
        {
          text: 'Сменить пароль',
          role: 'destructive',
          cssClass: 'primary',
          handler: () => {
            this.router.navigate(['change-password']);
          }
        }
      ]
    });
    await actionSheet.present();
  }

  getDateString(date: string) {
    return this.datePipe.transform(new Date(date), 'MMM d yy');
  }
}
