import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from '../home.component';
import { TaskComponent } from '../tasks/task.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'tasks', component: TaskComponent },
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
