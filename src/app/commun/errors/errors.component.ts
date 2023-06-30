import { Component, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-errors',
  templateUrl: './errors.component.html',
  styleUrls: ['./errors.component.scss']
})
export class ErrorsComponent {

  @Input() field!: FormControl
  @Input() type!: String

  patternMessage = () => {
    switch (this.type) {
      case 'password' : {
        return 'Le mot de passe doit contenir au moins une lettre minuscule et majuscule, un chiffre et un caratère *-+?!'
      }
      case 'phone' : {
        return 'Doit être de la forme : 00 00 00 00 00'
      }
      default : {
        return 'Expression non valide'
      }
    }
  }

}
