import { Component } from '@angular/core';

import {MenuController, Platform} from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import {AuthService} from './providers/auth.service';
import {Router} from '@angular/router';
import {Storage} from '@ionic/storage';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  public appPages = [
    {
      title: 'Dashbord',
      url:'/dashboard',
      icon:'home'
    },
    {
      title: 'Profile',
      url: '/profile',
      icon: 'person'
    },
    {
      title: 'Devices',
      url:'/devices',
      icon:'tablet-portrait',
    },
    {
      title:'Settings',
      url:'/settings',
      icon:'settings'
    },
  ];
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private authService: AuthService,
    private router: Router,
    private menu:MenuController,
    private storage: Storage
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  logout(){
    console.log("dans la fonction")
    this.authService.signOutUser().subscribe(
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
}
