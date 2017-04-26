import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from '../home.component';
import { TaskListComponent } from '../tasks/task-list.component';
import { TaskComponent } from '../tasks/task.component';
import { CluesComponent } from '../user/clues.component';
import { LoginComponent } from '../user/login.component';
import { ForgotComponent } from '../user/forgot.component';
import { ResetComponent } from '../user/reset.component';
import { RegisterComponent } from '../user/register.component';
import { GameCreatorComponent } from '../game-creator.component';
import { UserProgressComponent } from '../user-progress.component';
import { RoutingGuard, AdminRoutingGuard } from './router.guard';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'tasks', component: TaskListComponent, canActivate: [RoutingGuard] },
  { path: 'task/:task_id', component: TaskComponent, canActivate: [RoutingGuard] },
  { path: 'clues', component: CluesComponent, canActivate: [RoutingGuard] },
  { path: 'gamecreator', component: GameCreatorComponent, canActivate: [AdminRoutingGuard]},
  { path: 'userprogress', component: UserProgressComponent, canActivate: [AdminRoutingGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'forgot', component: ForgotComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'reset/:token', component: ResetComponent },
  { path: '**', redirectTo: '/', pathMatch: 'full' }
]

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  providers: [RoutingGuard, AdminRoutingGuard],
  exports: [
    RouterModule
  ]
})
export class RoutingModule { }
