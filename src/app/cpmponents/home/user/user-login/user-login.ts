import { Component } from '@angular/core';
import { NgClass } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { UserService } from '../../../../components/home/services/user/user';
import { LoginToken } from '../../../../components/home/types/user.type';
import { Location } from '@angular/common';
import { error } from 'console';
import e from 'express';
@Component({
  selector: 'app-user-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, NgClass],
  templateUrl: './user-login.html',
})
export class UserLogin {
  userLoginForm: FormGroup;

  alertType: number = 0; // 0-accept   1-warning   2-error
  alertMessage: string = '';

  constructor(private readonly formBuilder: FormBuilder, private readonly userService: UserService, private readonly location: Location) {
    this.userLoginForm = this.formBuilder.group({
      email: ['', { validators: [Validators.required, Validators.email] }],
      password: ['', Validators.required],
    });
  }

  get email(): AbstractControl<any, any> | null {
    return this.userLoginForm.get('email');
  }

  get password(): AbstractControl<any, any> | null {
    return this.userLoginForm.get('password');
  }

  onSubmit(): void {
    if (this.userLoginForm.invalid) {
      this.alertType = 1;
      this.alertMessage = 'Please fill in all required fields correctly.';
      this.userLoginForm.markAllAsTouched();
      return;
    }

    this.alertMessage = '';

    const { email, password } = this.userLoginForm.value;

    this.userLoginForm.disable();

    this.userService.login(email, password).subscribe({
      next: (response: LoginToken) => {
        this.userLoginForm.enable();

        if (response.token) {
          response.user.email = this.email?.value; // Ensure email is set in user info
          this.userService.activateToken(response);
          this.alertType = 0;
          this.alertMessage = 'Login successful!';
          this.userLoginForm.reset();
        } else {
          this.alertType = 1;
          this.alertMessage = 'Login failed. Please try again.';
        }

          setTimeout(() => {
            this.location.back();
          }, 1000);

      },
      error: (error) => {
        console.error('Login failed:', error);
        this.userLoginForm.enable();
        this.alertType = 2;
        this.alertMessage = error.error?.message || 'Login failed. Please try again.';
      }
    });
  }
}
