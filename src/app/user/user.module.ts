import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RoutingModule } from '../routing/routing.module';

import { LoginComponent } from './login.component';
import { RegisterComponent } from './register.component';
import { CluesComponent } from './clues.component';
import { UserService } from './user.service';


@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    CluesComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RoutingModule,
    ReactiveFormsModule
  ],
  exports: [
  ],
  providers: [ UserService ],
})
export class UserModule { }
