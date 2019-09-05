import { Injectable } from '@angular/core';
import {User} from '../models/user.model';
import {User_idService} from './user_id.service';
import {Storage} from '@ionic/storage';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {


  user:User;
  UserSubject = new Subject<User>();

  constructor(private user_id :User_idService,
              private storage: Storage) {
              this.get_User_data();
  }


  emitUser() {
    this.UserSubject.next(this.user);
  }

  get_User_data(){
    this.storage.ready().then(() => {
      this.storage.get(this.user_id.uid).then((value:User) =>{
        this.user=value;
        this.emitUser();
      });

    });

  }

}


