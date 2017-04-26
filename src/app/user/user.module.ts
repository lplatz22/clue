import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RoutingModule } from '../routing/routing.module';
import { ModalModule } from 'ng2-bootstrap';
import { LoginComponent } from './login.component';
import { RegisterComponent } from './register.component';
import { CluesComponent } from './clues.component';
import { UserService } from './user.service';
import { ForgotComponent } from './forgot.component';
import { ResetComponent } from './reset.component';
import { Angular2FontawesomeModule } from 'angular2-fontawesome/angular2-fontawesome'


@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    CluesComponent,
    ForgotComponent,
    ResetComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RoutingModule,
    ReactiveFormsModule,
    ModalModule.forRoot(),
    Angular2FontawesomeModule
  ],
  exports: [
  ],
  providers: [ UserService ],
})
export class UserModule { }
