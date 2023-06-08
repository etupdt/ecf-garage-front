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
import { AuthGuard } from './services/auth-guard';
import { UsersComponent } from './pages/user/users.component';
import { GaragesComponent } from './pages/garage/garages.component';
import { ServicesComponent } from './pages/service/services.component';
import { OptionsComponent } from './pages/option/options.component';
import { CommentsComponent } from './pages/comment/comments.component';

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
    path: 'Administration',
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    children: [
      {
        path: 'Garage',
        component: GaragesComponent,
        data: {
          role: 'ROLE_ADMIN'
        }
      },
      {
        path: 'Service',
        component: ServicesComponent,
        data: {
          role: 'ROLE_ADMIN'
        }
      },
      {
        path: 'User',
        component: UsersComponent,
        data: {
          role: 'ROLE_USER'
        }
      },
      {
        path: 'Car',
        component: CarComponent,
        data: {
          role: 'ROLE_USER'
        }
      },
      {
        path: 'Comment',
        component: CommentsComponent,
        data: {
          role: 'ROLE_USER'
        }
      },
      {
        path: 'Option',
        component: OptionsComponent,
        data: {
          role: 'ROLE_USER'
        }
      },
    ]
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
