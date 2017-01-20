import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from '../home.component';
import { TaskListComponent } from '../tasks/task-list.component';
import { TaskComponent } from '../tasks/task.component';
import { LoginComponent } from '../user/login.component';
import { RegisterComponent } from '../user/register.component';
import { RoutingGuard } from './router.guard';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'tasks', component: TaskListComponent, canActivate: [RoutingGuard] },
  { path: 'task/:task_id', component: TaskComponent, canActivate: [RoutingGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
]

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  providers: [RoutingGuard],
  exports: [
    RouterModule
  ]
})
export class RoutingModule { }
