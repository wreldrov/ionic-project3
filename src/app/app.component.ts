import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import {AuthService} from './services/auth.service';
import {Router} from '@angular/router';

interface Iuser {
  email: string;
  id: number;
  role: Irole;
}
interface Irole {
  created_at: string;
  id: number;
  name: string;
  updated_at: string;
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
      roles: ['Admin', 'Teacher', 'Student']
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
      title: 'Домашное задание',
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
  ) {
    this.auth.authUser.subscribe((res: Iuser) => {
      this.user = res;
    });
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      this.auth.authenticationState.subscribe(state => {
        if (state) {
          if (this.user.role.name === 'Admin') {
            this.router.navigate(['inside']);
          }
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
