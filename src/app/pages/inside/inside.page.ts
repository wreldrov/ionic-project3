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

  data = '';

  constructor(
      private authService: AuthService,
      private storage: Storage,
      private toastController: ToastController
  ) { }

  ngOnInit() {
  }

  loadUserInfo() {
    this.authService.getUserData().subscribe(res => {
      this.data = res['msg'];
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
}
