import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private fb : FormBuilder, public userService : UserService, private snackbar : MatSnackBar, private router : Router) { }

  ngOnInit(): void {
  }

  loginForm = this.fb.group({
    email: ['',[Validators.required,Validators.email]],
    password: ['',[Validators.required,Validators.minLength(6)]]
  });

  login() {
      this.userService.getUser(this.loginForm.value.email).then((res : any) => {
      console.log(res);
      if(res.length == 0) {
        console.log("Account does not exist");
        this.snackbar.open('Account does not exist', 'OK');
      } else {
        if(res[0].password === this.loginForm.value.password) {
          console.log("matched");
          this.snackbar.open('Login successfull', 'OK');
          this.userService.user = res[0]; //res è un array
          this.router.navigate(['/posts']);
        } else {console.log("incorrect password");
        this.snackbar.open("Incorrect password", 'OK');
      }
      }
     }).catch((err) =>
      {console.log(err);
    });
  }
}
