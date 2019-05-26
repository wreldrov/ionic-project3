import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {Storage} from '@ionic/storage';
import {ToastController} from '@ionic/angular';

@Component({
  selector: 'app-inside',
  templateUrl: './inside.page.html',
  styleUrls: ['./inside.page.scss'],
})
export class InsidePage implements OnInit {

  user = null;
  data = '';

  constructor(
      private authService: AuthService,
      private storage: Storage,
      private toastController: ToastController
  ) {
    // this.authService.getUserData().subscribe(res => {
    //   this.user = res['data']['user'];
    // });
  }

  ngOnInit() {
  }

  loadUserInfo() {
    console.log(this.authService.getUserData())
    this.authService.getUserData().subscribe(res => {
      this.data = res['data']['user']['email'];
    });
  }

  logout() {
    this.authService.logout();
  }

  clearToken() {
    this.storage.remove('access_token');

    const toast = this.toastController.create({
      message: 'JWT removed',
      duration: 3000
    });

    toast.then(toast => toast.present());
  }

    getUser() {
      this.authService.getUserData().subscribe(res => {
        this.user = res['data']['user'];
        return this.user;
      });
    }

    isAuthenticated() {
        return this.authService.isAuthenticated();
    }

    checkRoles(roles) {
        if (this.isAuthenticated()) {
            this.authService.getUserData().subscribe(res => {
                console.log(roles.indexOf(res['data']['user']['role']['name']) !== -1);
            });
        }
        console.log(false);
    }
}
