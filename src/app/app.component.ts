import { Component } from '@angular/core';

import {LoadingController, Platform} from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import {AuthService} from './services/auth.service';
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
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {

  user: Iuser;

  public appMenus = [
    // {
    //   title: 'Профиль',
    //   url: '/admin',
    //   icon: 'person',
    //   roles: ['Admin']
    // },
    {
      title: 'Профиль',
      url: '/teacher',
      icon: 'person',
      roles: ['Teacher']
    },
    {
      title: 'Профиль',
      url: '/student',
      icon: 'person',
      roles: ['Student']
    },
    {
      title: 'Группы',
      url: '/groups',
      icon: 'list',
      roles: ['Admin', 'Teacher']
    },
    {
      title: 'Рассписания',
      url: '/schedule',
      icon: 'paper',
      roles: ['Admin', 'Teacher', 'Student']
    },
    {
      title: 'Домашняя задание',
      url: '/homework',
      icon: 'list-box',
      roles: ['Student']
    },
    {
      title: 'Учителя',
      url: '/teachers',
      icon: 'school',
      roles: ['Admin', 'Student']
    },
    {
      title: 'Messenger',
      url: '/messenger',
      icon: 'chatboxes',
      roles: ['Admin', 'Teacher', 'Student']
    }
  ];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private auth: AuthService,
    private router: Router,
    private loadingController: LoadingController
  ) {
    this.initializeApp();
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
        loading.dismiss();
      });
    });
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      this.auth.authenticationState.subscribe(state => {
        if (state) {
          // this.auth.authUser.subscribe((res: Iuser) => {
          //   if (res.role.name === 'Admin') {
          //     this.router.navigate(['/admin']);
          //   } else if (res.role.name === 'Teacher') {
          //     this.router.navigate(['groups']);
          //   }
          // });
          this.router.navigate(['inside']);
        } else {
          this.router.navigate(['login']);
        }
      });
    });
  }

  isAuthenticated() {
    return this.auth.isAuthenticated();
  }

  logout() {
    this.auth.logout();
  }
}
