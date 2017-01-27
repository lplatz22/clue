import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from '../home.component';
import { TaskListComponent } from '../tasks/task-list.component';
import { TaskComponent } from '../tasks/task.component';
import { CluesComponent } from '../user/clues.component';
import { LoginComponent } from '../user/login.component';
import { RegisterComponent } from '../user/register.component';
import { GameCreatorComponent } from '../game-creator.component';
import { RoutingGuard } from './router.guard';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'tasks', component: TaskListComponent, canActivate: [RoutingGuard] },
  { path: 'task/:task_id', component: TaskComponent, canActivate: [RoutingGuard] },
  { path: 'clues', component: CluesComponent, canActivate: [RoutingGuard] },
  { path: 'gamecreator', component: GameCreatorComponent},
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
