import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {MenuController} from '@ionic/angular';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit{


  map= new Map();
  constructor(private router: Router,
              private menu:MenuController,
              private storage: Storage) {
    this.menu.enable(false);
     this.map.set("a",68);
  }
ngOnInit(){
    console.log(this.map.has('b'));
}
  Login(){
    this.router.navigate(['/login']);
  }

  Register(){
    this.router.navigate(['/register'])
  }
}

