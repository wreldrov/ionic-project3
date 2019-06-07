import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {StudentPageRoutingModule} from './student.router.module';

import { StudentPage } from './student.page';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    StudentPageRoutingModule
  ],
  declarations: [StudentPage]
})
export class StudentPageModule {}
