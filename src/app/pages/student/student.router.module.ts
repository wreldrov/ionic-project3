import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudentPage } from './student.page';

const routes: Routes = [
  {
    path: 'student/student',
    component: StudentPage,
    children: [
      {
        path: 'profile',
        children: [
          {
            path: '',
            loadChildren: '../profile/profile.module#ProfilePageModule'
          }
        ]
      },
      {
        path: '',
        redirectTo: 'student/student/profile',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: 'student/student/profile',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class StudentPageRoutingModule {}
