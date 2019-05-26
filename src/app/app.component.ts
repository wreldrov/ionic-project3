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

  user = null;

  public appPagesAdmin = [
    {
      title: 'Профиль',
      url: '/profile',
      icon: 'person',
    },
    {
      title: 'Группы',
      url: '/groups',
      icon: 'list',
    },
    {
      title: 'Рассписания',
      url: '/schedule',
      icon: 'paper',
    },
    {
      title: 'Учителя',
      url: '/teachers',
      icon: 'school',
    },
    {
      title: 'Messenger',
      url: '/messenger',
      icon: 'chatboxes',
    }
  ];

  public appPagesTeacher = [
    {
      title: 'Профиль',
      url: '/profile',
      icon: 'person',
    },
    {
      title: 'Группы',
      url: '/groups',
      icon: 'list',
    },
    {
      title: 'Рассписания',
      url: '/schedule',
      icon: 'paper',
    },
    {
      title: 'Messenger',
      url: '/messenger',
      icon: 'chatboxes',
    }
  ];

  public appPagesStudent = [
    {
      title: 'Профиль',
      url: '/profile',
      icon: 'person',
    },
    {
      title: 'Рассписания',
      url: '/schedule',
      icon: 'paper',
    },
    {
      title: 'Домашное задание',
      url: '/homework',
      icon: 'list-box',
    },
    {
      title: 'Учителя',
      url: '/teachers',
      icon: 'school',
    },
    {
      title: 'Messenger',
      url: '/messenger',
      icon: 'chatboxes',
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

  getUser() {
    this.auth.getUserData().subscribe(res => {
      this.user = res['data']['user'];
      return this.user;
    });
  }

  isAuthenticated() {
    return this.auth.isAuthenticated();
  }

  getMenu() {
    if (this.isAuthenticated()) {
      if (this.user === null) {
        this.user = this.getUser();
      }
      if (this.user['role']['id'] === 1) {
        return this.appPagesAdmin;
      } else if (this.user['role']['id'] === 2) {
        return this.appPagesTeacher;
      } else {
        return this.appPagesStudent;
      }
    }
    return [];
  }
}
