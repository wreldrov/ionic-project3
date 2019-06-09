import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import {AuthGuardService} from './services/auth-guard.service';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login',      loadChildren: './pages/login/login.module#LoginPageModule' },
  { path: 'inside',     loadChildren: './pages/inside/inside.module#InsidePageModule',       canActivate: [AuthGuardService] },
  { path: 'groups',     loadChildren: './pages/groups/groups.module#GroupsPageModule',       canActivate: [AuthGuardService] },
  { path: 'schedule',   loadChildren: './pages/schedule/schedule.module#SchedulePageModule', canActivate: [AuthGuardService] },
  { path: 'group/:id',  loadChildren: './pages/group/group.module#GroupPageModule',          canActivate: [AuthGuardService] },
  { path: 'lesson/:id', loadChildren: './pages/lesson/lesson.module#LessonPageModule',       canActivate: [AuthGuardService] },
  { path: 'student',    loadChildren: './pages/student/student.module#StudentPageModule',    canActivate: [AuthGuardService] },
  { path: 'teacher',    loadChildren: './pages/teacher/teacher.module#TeacherPageModule',    canActivate: [AuthGuardService] },
  { path: 'profile',    loadChildren: './pages/profile/profile.module#ProfilePageModule',    canActivate: [AuthGuardService] },
  { path: 'messenger', loadChildren: './pages/messenger/messenger.module#MessengerPageModule', canActivate: [AuthGuardService] },
  { path: 'teachers',   loadChildren: './pages/teachers/teachers.module#TeachersPageModule', canActivate: [AuthGuardService] },
  { path: 'finance',    loadChildren: './pages/finance/finance.module#FinancePageModule',    canActivate: [AuthGuardService] },
  { path: 'chat',       loadChildren: './pages/chat/chat.module#ChatPageModule',             canActivate: [AuthGuardService] },
  { path: 'homework',   loadChildren: './pages/homework/homework.module#HomeworkPageModule', canActivate: [AuthGuardService] },
  { path: 'profile-edit', loadChildren: './pages/profile-edit/profile-edit.module#ProfileEditPageModule',
    canActivate: [AuthGuardService] },
  { path: 'change-password', loadChildren: './pages/change-password/change-password.module#ChangePasswordPageModule',
    canActivate: [AuthGuardService] },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
