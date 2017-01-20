import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RoutingModule } from '../routing/routing.module';

import { LoginComponent } from './login.component';
import { RegisterComponent } from './register.component';
import { UserService } from './user.service';


@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RoutingModule
  ],
  exports: [
  ],
  providers: [ UserService ],
})
export class UserModule { }
