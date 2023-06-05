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
        component: GarageComponent,
        data: {
          role: 'ROLE_ADMIN'
        }
      },
      {
        path: 'Service',
        component: ServiceComponent,
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
        component: CommentComponent,
        data: {
          role: 'ROLE_USER'
        }
      },
      {
        path: 'Option',
        component: OptionComponent,
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
