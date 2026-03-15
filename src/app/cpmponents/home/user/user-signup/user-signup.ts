import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, AbstractControl, ValidationErrors, Validators } from '@angular/forms';
import { UserService } from '../../../../components/home/user/servises/user';
import { User } from '../../../../components/home/types/user.type';
import { NgClass } from '@angular/common';
@Component({
  selector: 'app-user-signup',
  imports: [ReactiveFormsModule,NgClass],
  templateUrl: './user-signup.html',
  styleUrl: './user-signup.css',
  providers: [UserService],
})
export class UserSignup {
  userSIgnupForm: FormGroup;
  alertMessage: string = '';
  alerertType: number = 0;  // 0-accept   1-warning   2-error


  constructor(private readonly formBuilder: FormBuilder, private readonly userService: UserService) {
    this.userSIgnupForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: [''],
      email: ['', [Validators.required, Validators.email]],
      address: [''],
      city: [''],
      state: [''],
      pin: [''],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    }, {
      validators: [this.passwordMatchValidator],
    });
  }

  private passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;

    if (!password || !confirmPassword) {
      return null;
    }

    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  get firstName(): AbstractControl<any, any> | null {
    return this.userSIgnupForm.get('firstName');
  }

  get email(): AbstractControl<any, any> | null {
    return this.userSIgnupForm.get('email');
  }

  get password(): AbstractControl<any, any> | null {
    return this.userSIgnupForm.get('password');
  }

  get confirmPassword(): AbstractControl<any, any> | null {
    return this.userSIgnupForm.get('confirmPassword');
  }

  get hasPasswordMismatch(): boolean {
    return !!this.userSIgnupForm.errors?.['passwordMismatch'] && !!this.confirmPassword?.touched;
  }

  onSubmit(): void {
    if (this.userSIgnupForm.invalid) {
      this.alertMessage = 'Please fill in all required fields correctly.';
      this.alerertType = 1;
      this.userSIgnupForm.markAllAsTouched();
      return;
    }

    const { firstName, lastName, email, address, city, state, pin, password } = this.userSIgnupForm.value;
    const newUser: User = {
      firstName,
      lastName,
      email,
      address,
      city,
      state,
      pin,
      password,
    };
    this.userSIgnupForm.disable();

    this.userService.createUser(newUser).subscribe({
      next: (response) => {
        this.userSIgnupForm.enable();

        if (response.message === "Success") {
          this.alertMessage = 'User created successfully!';
          this.alerertType = 0;
          this.userSIgnupForm.reset();
        }else if(response.message === "Email already exists") {
          this.alertMessage = 'Email already exists. Please use a different email.';
          this.alerertType = 1;
        }

      },
      error: (err)=> {
        this.userSIgnupForm.enable();
        this.alertMessage = err.message || 'An error occurred while creating the user.';
        this.alerertType = 2;
      }
    });
  }

}
