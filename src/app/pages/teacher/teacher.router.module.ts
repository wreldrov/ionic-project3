import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TeacherPage } from './teacher.page';

const routes: Routes = [
  {
    path: 'teacher/teacher',
    component: TeacherPage,
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
        path: 'finance',
        children: [
          {
            path: '',
            loadChildren: '../finance/finance.module#FinancePageModule'
          }
        ]
      },
      {
        path: '',
        redirectTo: 'teacher/teacher/profile',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: 'teacher/teacher/profile',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class TeacherPageRoutingModule {}
