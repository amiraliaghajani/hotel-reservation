import { Component, signal , OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, 
          FormGroup,
         Validators,
        ReactiveFormsModule ,
        AbstractControl} from '@angular/forms';
import { merge, Observable } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { FlexLayoutModule } from '@angular/flex-layout';

import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import { Router } from '@angular/router';


import { UserType } from '../../interface/user-type';

function equalValues(controlName1: string, controlName2: string) {
  return (control: AbstractControl) => {
    const val1 = control.get(controlName1)?.value;
    const val2 = control.get(controlName2)?.value;

    if (val1 === val2) {
      return null;
    }

    return { valuesNotEqual: true };
  };
}


@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    MatInputModule,
    MatIconModule,
    MatFormFieldModule,
    MatButtonModule,
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    FlexLayoutModule,
    MatSelectModule
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})








export class SignupComponent implements OnInit{

  phoneForm!: FormGroup;
  hide = signal(true);
  errorMessage = signal('');
  readonly email = new FormControl('', [Validators.required, Validators.email]);

  form = new FormGroup({
    email: new FormControl('', {
      validators: [Validators.email, Validators.required,Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)],
    }),
    passwords: new FormGroup(
      {
        password: new FormControl('', {
          validators: [Validators.required, Validators.minLength(6), Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]+$/)],
        }),
        confirmPassword: new FormControl('', {
          validators: [Validators.required, Validators.minLength(6),  Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]+$/)],
        }),
      },
      {
        validators: [equalValues('password', 'confirmPassword')],
      }),
      persianFirstName: new FormControl('', {
        validators: [ Validators.required, Validators.pattern('^[a-zA-Z ]+$')],
      }),
      persianLastName: new FormControl('', {
        validators: [ Validators.required , Validators.pattern('^[a-zA-Z ]+$')],
      }),
      englishFirstName: new FormControl('', {
        validators: [ Validators.required , Validators.pattern('^[a-zA-Z ]+$')],
      }),
      englishLastName: new FormControl('', {
        validators: [ Validators.required, Validators.pattern('^[a-zA-Z ]+$')],
      }),
      number: new FormControl('', {  validators: [ Validators.required , Validators.pattern('[0-9]')], }),
      internalNumber: new FormControl('', { validators: [Validators.required,Validators.pattern('[0-9]')] }),
      grade: new FormControl('', { validators: [Validators.required,Validators.pattern('^[a-zA-Z ]+$')] }),
      unit: new FormControl('', { validators: [Validators.required,Validators.pattern('^[a-zA-Z ]+$')] }),
      role: new FormControl<
      'admin' | 'user'
    >('user', { validators: [Validators.required] }),


    })




  
  constructor(private router:Router,) {
    merge(this.email.statusChanges, this.email.valueChanges)
    .pipe(takeUntilDestroyed())
    .subscribe(() => this.updateErrorMessage());;

  }




ngOnInit(): void {
 
}




clickEvent(event: MouseEvent) {
  this.hide.set(!this.hide());
  event.stopPropagation();
}
updateErrorMessage() {
  if (this.email.hasError('required')) {
    this.errorMessage.set('You must enter a value');
  } else if (this.email.hasError('email')) {
    this.errorMessage.set('Not a valid email');
  } else {
    this.errorMessage.set('');
  }
}

generateRandomId(): number {
  return Date.now() + Math.floor(Math.random() * 1000);
}


onSubmit() {
  if (this.form.invalid) {
    console.log('INVALID FORM');
    console.log(this.form);
    return;
  }
  const user: UserType = {
    id:this.generateRandomId(),
    persianFirstName : this.form.value.persianFirstName!,
    persianLastName : this.form.value.persianLastName!,
    englishFirstName : this.form.value.englishFirstName!,
    englishLastName : this.form.value.englishLastName!,
    emailAddress : this.form.value.email!,
    password : this.form.value.passwords?.password!,
    phoneNumber : this.form.value.number!,
    internalPhoneNumber : +this.form.value.internalNumber!,
    grade : this.form.value.grade!,
    unit: this.form.value.unit!,
    accessType : this.form.value.role!,
    imageUrl: '',
  };

this.router.navigate(['/search']); 
}

onReset() {
  this.form.reset();
}









}

