import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { OccasionsComponent } from './pages/occasions/occasions.component';
import { ContactComponent } from './pages/contact/contact.component';
import { LoginComponent } from './pages/login/login.component';
import { GarageComponent } from './pages/garage/garage.component';
import { ServiceComponent } from './pages/service/service.component';
import { CarComponent } from './pages/car/car.component';
import { CommentComponent } from './pages/comment/comment.component';
import { OptionComponent } from './pages/option/option.component';
import { UserComponent } from './pages/user/user.component';

const routes: Routes = [

  {
    path: 'Accueil',
    component: HomeComponent,
  },
  {
    path: 'Occasions',
    component: OccasionsComponent,
  },
  {
    path: 'Contact',
    component: ContactComponent,
  },
  {
    path: 'Garage',
    component: GarageComponent,
  },
  {
    path: 'Service',
    component: ServiceComponent,
  },
  {
    path: 'User',
    component: UserComponent,
  },
  {
    path: 'Car',
    component: CarComponent,
  },
  {
    path: 'Comment',
    component: CommentComponent,
  },
  {
    path: 'Option',
    component: OptionComponent,
  },
  {
    path: 'Signin',
    component: LoginComponent,
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
