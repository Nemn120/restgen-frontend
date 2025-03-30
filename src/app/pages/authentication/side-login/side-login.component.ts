import { Component, inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'src/app/material.module';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-side-login',
  imports: [RouterModule, MaterialModule, FormsModule, ReactiveFormsModule],
  templateUrl: './side-login.component.html',
})
export class AppSideLoginComponent {

  authService= inject(AuthService)
  constructor(private router: Router) {}

  form = new FormGroup({
    uname: new FormControl('', [Validators.required, Validators.minLength(6)]),
    password: new FormControl('', [Validators.required]),
  });

  get f() {
    return this.form.controls;
  }
  submit() {
    if (this.form.valid) {
      const username = this.form.get('uname')?.value;
      const password = this.form.get('password')?.value;

      this.authService.login(username, password).subscribe(
        () => {
          this.router.navigate(['']);
        },
        (error) => {
          console.error('Error en el login', error);
        }
      );
    } else {
      console.log('Formulario inválido');
    }
  }

}
