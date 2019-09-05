import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { FormGroup,FormBuilder,Validators } from '@angular/forms';
import { HttpClient, HttpParams,HttpHeaders} from '@angular/common/http';
import {AuthService} from '../../providers/auth.service';
import {MenuController} from '@ionic/angular';


@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  userFrom: FormGroup;
  errorMessage: string;

  constructor(private router: Router,
              private formBuilder: FormBuilder,
              private authService: AuthService,
              private menu :MenuController) {

       this.menu.enable(false);
  }

  ngOnInit() {

    this.initForm();
  }

  initForm() {
    this.userFrom = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.pattern(/[0-9a-zA-Z]{6,}/)]],
      username: ['', [Validators.required]]
    });
  }


  register(){
    const email =this.userFrom.get('email').value;
    const password = this.userFrom.get('password').value;
    const username = this.userFrom.get('username').value;
    this.authService.createNewUser(username,email,password).subscribe(

        (data)=> {console.log(data)},

        (err)=>{ this.errorMessage=err['error'].substring(0,16)  },

        ()=> {console.log("all is good ");
                        this.router.navigate(['/login']);}
    );

  }
  Home() {
    this.userFrom.reset();
    this.router.navigate(['/home']);
  }

  login() {
    this.router.navigate(['/login']);
  }

}
