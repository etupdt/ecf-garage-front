import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { OccasionsComponent } from './pages/occasions/occasions.component';
import { ContactComponent } from './pages/contact/contact.component';

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
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
