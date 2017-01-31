import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RoutingModule } from './routing/routing.module';
import { AuthenticationService } from './authentication.service';

import { CollapseModule, AccordionModule, ModalModule, AlertModule, ProgressbarModule } from 'ng2-bootstrap';
import { TaskModule } from './tasks/task.module';
import { UserModule } from './user/user.module';

import { AppComponent } from './app.component';
import { NavComponent } from './nav.component';
import { HomeComponent } from './home.component';
import { GameCreatorComponent } from './game-creator.component';
import { UserProgressComponent } from './user-progress.component';


@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    HomeComponent,
    GameCreatorComponent,
    UserProgressComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RoutingModule,
    TaskModule,
    UserModule,
    CollapseModule.forRoot(),
    AccordionModule.forRoot(),
    ModalModule.forRoot(),
    AlertModule.forRoot(),
    ProgressbarModule.forRoot()
  ],
  providers: [ AuthenticationService ],
  bootstrap: [AppComponent]
})
export class AppModule { }
