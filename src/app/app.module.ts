import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderComponent } from './commun/header/header.component';
import { HomeComponent } from './pages/home/home.component';
import { OccasionsComponent } from './pages/occasions/occasions.component';
import { ContactComponent } from './pages/contact/contact.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './pages/login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from  '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from  '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { GarageComponent } from './pages/garage/garage.component';
import { ServiceComponent } from './pages/service/service.component';
import { CarComponent } from './pages/car/car.component';
import { UserComponent } from './pages/user/user.component';
import { CommentComponent } from './pages/comment/comment.component';
import { OptionComponent } from './pages/option/option.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatSelectModule } from '@angular/material/select';
import { HttpInterceptorService } from './services/http-interceptor.service';
import { ErrorInterceptorService } from './services/error-interceptor.service';
import { MessageDialogComponent } from './dialogs/message-dialog/message-dialog.component';
import { ConfirmDialogComponent } from './dialogs/confirm-dialog/confirm-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { UsersComponent } from './pages/user/users.component';
import { MatTableModule } from '@angular/material/table';
import { FooterComponent } from './commun/footer/footer.component';
import { MatListModule } from '@angular/material/list';
import { GaragesComponent } from './pages/garage/garages.component';
import { ServicesComponent } from './pages/service/services.component';
import { OptionsComponent } from './pages/option/options.component';
import { CommentsComponent } from './pages/comment/comments.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CarsComponent } from './pages/car/cars.component';
import { GalleryComponent } from './commun/gallery/gallery.component';
import { IsEmployeDirective } from './directives/is-employe.directive';
import { MatCardModule } from '@angular/material/card';
import { RoleDirective } from './directives/role.directive';
import { OrientableDirective } from './directives/orientable.directive';
import { MatSliderModule } from '@angular/material/slider';
import { FilterPipe } from './pages/occasions/filter.pipe';
import { OccasionComponent } from './pages/occasions/occasion.component';
import { ContactsComponent } from './pages/contact/contacts.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    OccasionsComponent,
    ContactComponent,
    LoginComponent,
    GarageComponent,
    ServiceComponent,
    CarComponent,
    CommentComponent,
    OptionComponent,
    MessageDialogComponent,
    ConfirmDialogComponent,
    UsersComponent,
    UserComponent,
    FooterComponent,
    GaragesComponent,
    ServicesComponent,
    OptionsComponent,
    CommentsComponent,
    CarsComponent,
    GalleryComponent,
    IsEmployeDirective,
    RoleDirective,
    OrientableDirective,
    FilterPipe,
    OccasionComponent,
    ContactsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatTabsModule,
    MatIconModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatMenuModule,
    MatGridListModule,
    MatSelectModule,
    MatDialogModule,
    MatButtonToggleModule,
    MatTableModule,
    MatListModule,
    MatCheckboxModule,
    MatCardModule,
    MatSliderModule
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: HttpInterceptorService, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptorService, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
