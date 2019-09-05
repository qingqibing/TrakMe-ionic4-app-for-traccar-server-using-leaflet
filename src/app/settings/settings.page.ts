import { Component, OnInit } from '@angular/core';
import {LoadingController, MenuController} from '@ionic/angular';
import {AuthService} from '../providers/auth.service';
import {Route, Router} from '@angular/router';
import {User_idService} from '../providers/user_id.service';
import {Storage} from '@ionic/storage';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  loading: any;


  constructor(private menu :MenuController,
              private authservice: AuthService,
              private router :Router,
              private user_id :User_idService,
              private storage: Storage,
              public loadingCtrl: LoadingController,

  ) {
    this.menu.enable(true);
  }

  ngOnInit() {
  }
  async removeAccount(){

    this.loading = await this.loadingCtrl.create({
      message: 'Please wait...'
    });
    await this.loading.present();

    this.authservice.DeleteUser(this.user_id.uid).subscribe(
        (data)=>{
                  this.loading.dismiss();
                  console.log(data);},
        (err)=> {
                       console.log(err);
                       this.loading.dismiss();
        },
        ()=>{{
          this.storage.clear().then(()=>{
            console.log("user is out");
            this.menu.enable(false);
            this.router.navigate(['login']);
          }).catch(()=>{console.log("tap again")});
        }}
    )

  }
}
