import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {TeacherPageRoutingModule} from './teacher.router.module';

import { TeacherPage } from './teacher.page';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    TeacherPageRoutingModule
  ],
  declarations: [TeacherPage]
})
export class TeacherPageModule {}
