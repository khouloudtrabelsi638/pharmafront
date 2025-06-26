import { Component } from '@angular/core';
import {FormGroup, FormControl, Validators, ReactiveFormsModule} from '@angular/forms';
import {Router, RouterLink} from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {MatError, MatFormField, MatLabel} from "@angular/material/form-field";
import {MatIcon} from "@angular/material/icon";
import {MatCheckbox} from "@angular/material/checkbox";
import {MatCard, MatCardContent} from "@angular/material/card";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatInput} from "@angular/material/input";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-side-login',
  templateUrl: './side-login.component.html',
  imports: [
    MatProgressSpinner,
    RouterLink,
    MatError,
    MatIcon,
    MatLabel,
    ReactiveFormsModule,
    MatFormField,
    MatCheckbox,
    MatCard,
    MatCardContent,
    MatIconButton,
    MatButton,
    MatInput,
    CommonModule
  ]})
export class AppSideLoginComponent {
  isLoading = false;
  hidePassword = true;

  form = new FormGroup({
    uname: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required, Validators.minLength(4)]),
  });

  constructor(
    private router: Router,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.isLoading = true;

    const request = {
      code: this.form.value.uname!,
      pwd: this.form.value.password!
    };

    this.authService.login(request).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.snackBar.open('Connexion réussie', 'Fermer', { duration: 2500 });
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.isLoading = false;
        let message = 'Identifiants invalides ou erreur serveur';
        if (err?.error?.message) {
          message = err.error.message;
        }
        this.snackBar.open(message, 'Fermer', { duration: 3000 });
      }
    });
  }

  getErrorMessage(field: string): string {
    const control = this.form.get(field);
    if (!control) return '';
    if (control.hasError('required')) return 'Ce champ est requis';
    if (control.hasError('minlength')) return 'Le mot de passe doit contenir au moins 4 caractères';
    return '';
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }
}
