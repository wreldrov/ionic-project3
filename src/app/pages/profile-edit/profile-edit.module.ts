import { NgModule } from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import {IonicModule, LoadingController} from '@ionic/angular';

import { ProfileEditPage } from './profile-edit.page';
import {HttpClient} from '@angular/common/http';
import {AuthService} from '../../services/auth.service';

const routes: Routes = [
  {
    path: '',
    component: ProfileEditPage
  }
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        RouterModule.forChild(routes),
        ReactiveFormsModule
    ],
  declarations: [ProfileEditPage]
})
export class ProfileEditPageModule {}
