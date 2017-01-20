import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from '../home.component';
import { TaskListComponent } from '../tasks/task-list.component';
import { TaskComponent } from '../tasks/task.component';
import { LoginComponent } from '../user/login.component';
import { RegisterComponent } from '../user/register.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'tasks', component: TaskListComponent },
  { path: 'task/:task_id', component: TaskComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
]

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class RoutingModule { }
