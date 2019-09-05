import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { FormGroup,FormBuilder,Validators } from '@angular/forms';
import {AuthService} from '../../providers/auth.service';
import {MenuController} from '@ionic/angular';
import {User_idService} from '../../providers/user_id.service';
import { Storage } from '@ionic/storage';
import {User} from '../../models/user.model';



@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],

})
export class LoginPage implements OnInit {

  errorMessage: string;
  userForm :FormGroup;
  user :User;
  constructor(private router: Router,
              private formBuilder: FormBuilder,
              private authService: AuthService,
              private menu :MenuController,
              private user_id :User_idService,
              private storage: Storage) {

    this.menu.enable(false);


  }


  ngOnInit() {

    this.initForm();
  }

  initForm() {
    this.userForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.pattern(/[0-9a-zA-Z]{6,}/)]]
    });
  }
  Home(){
    this.userForm.reset();
    this.router.navigate(['/home']);
  }

  login() {


    const email = this.userForm.get('email').value;
    const password =this.userForm.get('password').value;

    this.authService.signInUser(email,password).subscribe(
        (data:User)=> {
          this.user=data;
          this.user_id.uid=this.user.id.toString();
          this.storage.ready().then(() => {
              this.storage.set(this.user_id.uid,this.user);
              this.router.navigate(['/profile']);
              this.userForm.reset();
          });


        },
        (err)=>{
                       this.errorMessage=err['statusText']},
        ()=> {console.log("all is good ");});


  }


  register(){
    this.userForm.reset();
    this.router.navigate(['/register']);
  }

  }
