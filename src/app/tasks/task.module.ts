import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RoutingModule } from '../routing/routing.module';

import { ProgressbarModule, AccordionModule } from 'ng2-bootstrap';

import { TaskListComponent } from './task-list.component';
import { TaskComponent } from './task.component';
import { TaskService } from './task.service';


@NgModule({
  declarations: [
    TaskListComponent,
    TaskComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RoutingModule,
    AccordionModule.forRoot()
  ],
  exports: [
  ],
  providers: [ TaskService ],
})
export class TaskModule { }
