import {Component, OnInit, ChangeDetectorRef, OnDestroy} from '@angular/core';
import { HttpClient, HttpParams,HttpHeaders} from '@angular/common/http';
import {MenuController} from '@ionic/angular';
import {User} from '../models/user.model';
import {ProfileService} from '../providers/profile.service';
import {Subscription} from 'rxjs';
import {AuthService} from '../providers/auth.service';
import {Router} from '@angular/router';
import {Storage} from '@ionic/storage';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit ,OnDestroy {

  UserSubscription :Subscription;
  user:User;
  constructor(private http:HttpClient,
              private menu :MenuController,
              private profile: ProfileService,
              private auth:AuthService,
              private router :Router,
              private storage: Storage) {


    this.menu.enable(true);
       this.profile.get_User_data();
       this.goEmit_user();
  }

  ngOnInit( ) {
  }

  goEmit_user() {
    this.UserSubscription = this.profile.UserSubject.subscribe(
        (user: User) => {
          console.log(user);
          this.user = user;

        }
    );
  }
    logout(){
        console.log("dans la fonction");
        this.auth.signOutUser().subscribe(
            ()=>{},
            ()=>{},
            ()=>{
                this.storage.clear().then(()=>{
                    console.log("user is out");
                    this.menu.enable(false);
                    this.router.navigate(['login']);
                }).catch(()=>{console.log("tap again")});
                }
        )
    }
ngOnDestroy(){
    this.UserSubscription.unsubscribe();
}

}
