import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {AuthService} from '../../services/auth.service';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {LoadingController} from '@ionic/angular';
import {catchError, map} from 'rxjs/operators';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';

interface Iuser {
  id: number;
  email: string;
  surname: string;
  name: string;
  image: string;
}
interface Ichat {
  id: number;
  from: Iuser;
  to: Iuser;
  message: string;
}
@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {
  userId: number;
  user: Iuser;
  chats: Ichat[];
  message: string;
  constructor(
      private route: ActivatedRoute,
      private auth: AuthService,
      private http: HttpClient,
      private loadingController: LoadingController,
  ) {
    this.message = '';
  }

  ngOnInit() {
    this.getData();
  }

  async getData() {
    const loading = await this.loadingController.create({
      spinner: 'crescent',
      message: 'Please wait...',
      translucent: true,
      cssClass: 'custom-class custom-loading'
    });
    return await loading.present().then(() => {
      this.route.params
          .subscribe((params: any) => {
            this.userId = params.id;
          });
      this.auth.authUser.subscribe((res: Iuser) => {
        this.user = res;
      });
      this.getChats().subscribe((res: Ichat[]) => {
        this.chats = res;
        loading.dismiss();
      });
    });
  }

  getChats() {
    let header = new HttpHeaders();
    header = header.append('Content-Type', 'application/json');
    header = header.append('Authorization', `Bearer ${this.auth.token}`);
    return this.http.get(`${this.auth.url}/api/igra/chat?filter[user_id]=${this.user.id},${this.userId}`, {headers: header}).pipe(
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

  sendMessageRequest(data) {
    let header = new HttpHeaders();
    header = header.append('Content-Type', 'application/json');
    header = header.append('Authorization', `Bearer ${this.auth.token}`);
    return this.http.post(`${this.auth.url}/api/igra/chat`, data, {headers: header}).pipe(
        map((res: any) => {
          console.log(res);
          return res.data;
        }),
        catchError(e => {
          throw new Error(e);
        })
    );
  }

  sendMessage() {
    console.log('sendMessage()');
    let data = {
      message: this.message,
      from: this.user.id,
      to: this.userId
    };
    return this.sendMessageRequest(data).subscribe((res: Ichat) => {
      this.chats.push(res);
    });
  }

}
