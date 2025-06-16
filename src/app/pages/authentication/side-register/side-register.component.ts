import { Component, inject } from '@angular/core';
import { CoreService } from 'src/app/services/core.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'src/app/material.module';
import { AuthService } from 'src/app/services/auth.service';
import { UserRegister } from 'src/app/models/user.register.model';

@Component({
  selector: 'app-side-register',
  imports: [RouterModule, MaterialModule, FormsModule, ReactiveFormsModule],
  templateUrl: './side-register.component.html',
  styleUrl: './side-register.component.scss'
})
export class AppSideRegisterComponent {
  options = this.settings.getOptions();

  authService= inject(AuthService)
  constructor(private settings: CoreService, private router: Router) {}

  form = new FormGroup({
    uname: new FormControl('', [Validators.required, Validators.minLength(4)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  get f() {
    return this.form.controls;
  }

  submit() {
    if (this.form.valid) {

      let user: UserRegister = {
        email: this.form.get('email')?.value,
        name: this.form.get('uname')?.value,
        password: this.form.get('password')?.value
      }

      this.authService.register(user).subscribe(
        () => {
          this.router.navigate(['']);
        },
        (error) => {
          console.error('Error register', error);
        }
      );
    } else {
      console.log('Formulario inválido');
    }
  }
}
