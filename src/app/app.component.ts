import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import {AuthService} from './services/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {

  public appPages = [
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
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      this.auth.authenticationState.subscribe(state => {
        if (state) {
          this.router.navigate(['inside']);
        } else {
          this.router.navigate(['login']);
        }
      });
    });
  }

  user() {
    this.auth.getUserData().subscribe(res => {
      return res['data']['user'];
    });
  }

  checkRoles(roles) {
    console.log(this.user());
    return true;
  }
}
