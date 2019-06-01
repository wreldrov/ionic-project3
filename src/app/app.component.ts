import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
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
    {
      title: 'Профиль',
      url: '/profile',
      icon: 'person',
      roles: ['admin', 'teacher', 'student']
    },
    {
      title: 'Группы',
      url: '/groups',
      icon: 'list',
      roles: ['admin', 'teacher']
    },
    {
      title: 'Рассписания',
      url: '/schedule',
      icon: 'paper',
      roles: ['admin', 'teacher', 'student']
    },
    {
      title: 'Домашное задание',
      url: '/homework',
      icon: 'list-box',
      roles: ['student']
    },
    {
      title: 'Учителя',
      url: '/teachers',
      icon: 'school',
      roles: ['admin', 'student']
    },
    {
      title: 'Messenger',
      url: '/messenger',
      icon: 'chatboxes',
      roles: ['admin', 'teacher', 'student']
    }
  ];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private auth: AuthService,
    private router: Router,
  ) {
    this.auth.authUser.subscribe((res: Iuser) => {
      this.user = res;
      console.log(this.user);
    });
    this.initializeApp();
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
}
