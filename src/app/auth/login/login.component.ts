import { Component, inject, signal } from '@angular/core';
import { FormGroup , FormControl,FormsModule,ReactiveFormsModule,Validators, NgForm, FormBuilder} from '@angular/forms';
import { delay, merge, Observable, of } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { GetUserService } from '../../services/get-user.service';
import { Router } from '@angular/router';



import {MatCardModule} from '@angular/material/card';

import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';


import { FlexLayoutModule } from '@angular/flex-layout';

import { UserType } from '../../interface/user-type';
import { HttpClientModule ,provideHttpClient } from '@angular/common/http';
import { CommentService } from '../../services/comment.service';
import { SignupService } from '../../services/signup.service';
import { UserDataService } from '../../services/login/user-data.service';
import { LoadingSignalService } from '../../services/UI/loading-signal.service';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MatInputModule,
    MatIconModule,
    MatFormFieldModule,
    MatButtonModule,
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    FlexLayoutModule,
    MatCardModule,
    MatSnackBarModule

  ],
  providers: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  private userDataService = inject(UserDataService)
  loadingSignalService = inject(LoadingSignalService);
  isLoading$: Observable<boolean>;
  currentUser: UserType | null = null;
  users: UserType[] = [];
  private _snackBar = inject(MatSnackBar);
  form = new FormGroup({
    email: new FormControl('', {
      validators: [Validators.email, Validators.required],
    }),
    password: new FormControl('', {
      validators: [
        Validators.required,
        Validators.minLength(6),
      ],
    }),
  });


  constructor(
    private fb: FormBuilder,
    private router: Router,
     private getUser:GetUserService,
     private commentService:CommentService,
     private signupService:SignupService
      ){

    merge(this.email.statusChanges, this.email.valueChanges)
    .pipe(takeUntilDestroyed())
    .subscribe(() => this.updateErrorMessage());
  this.isLoading$ = this.loadingSignalService.onLogin$
  }
  

  ngOnInit(): void {
 this.getUser.getUsers().subscribe(
  data => {
    this.users = data;
    console.log(this.users)
  },
  (error) => {
    console.error('error getting user data')
  }
 )
    
      }



// for email____________
readonly email = new FormControl('', [Validators.required, Validators.email]);

  errorMessage = signal('');


  updateErrorMessage() {
    if (this.email.hasError('required')) {
      this.errorMessage.set('You must enter a value');
    } else if (this.email.hasError('email')) {
      this.errorMessage.set('Not a valid email');
    } else {
      this.errorMessage.set('');
    }
  }

// for password________
hide = signal(true);
  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }


  generateFakeJWT(user: any): string {
    const header = { alg: "HS256", typ: "JWT" };
    const payload = {
      id: user.id,
      email: user.emailAddress,
      exp: Math.floor(Date.now() / 1000) + 60 * 60,  // Expires in 1 hour
    };
    const signature = "fake-signature";  // No real signature here for simplicity

    return [
      btoa(JSON.stringify(header)),
      btoa(JSON.stringify(payload)),
      signature
    ].join(".");
  }



  onSubmit() {
    if (this.form.valid) {
      this.loadingSignalService.setOnLogin(true);
  
      const email = this.form.get('email')?.value;
      const password = this.form.get('password')?.value;
  
      of(this.users.find(user => user.emailAddress === email && user.password === password))
        .pipe(delay(1500))
        .subscribe(user => {
          if (user) {
            this.currentUser = user;
            this.commentService.setUserId(user.id);
            const fakeToken = this.generateFakeJWT(user);
            localStorage.setItem('authToken', fakeToken);
            this.userDataService.setCurrentUser(user);
            this.router.navigate(['/welcome']);
            this.signupService.setLoginStatus(true);
            console.log('Login successful');
          } else {
            console.error('Invalid email or password');
            this.displayErrorMessage('Invalid email or password. Please try again.');
          }
          this.loadingSignalService.setOnLogin(false);
        }, error => {
          console.error('An error occurred:', error);
          this.loadingSignalService.setOnLogin(false);
        });
    }
  }
  
  displayErrorMessage(message: string): void {
    this._snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }
  




}
