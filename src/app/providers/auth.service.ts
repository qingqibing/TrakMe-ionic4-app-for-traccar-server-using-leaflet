import { Injectable } from '@angular/core';
import { HttpClient, HttpParams,HttpHeaders} from '@angular/common/http';
import {User} from '../models/user.model';
import {Router} from '@angular/router';
import {MenuController} from '@ionic/angular';
import {Storage} from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
    API_URL : string ='http://52.232.22.124/api/';

  constructor( private http:HttpClient,
               private router: Router,
               private storage: Storage,
               private menu:MenuController,) { }


    signInUser(email: string , password: string){

        const body = new HttpParams()
            .set(`email`, email)
            .set(`password`, password);

        const headers= new HttpHeaders({ 'Content-Type':  'application/x-www-form-urlencoded'});
        return(  this.http.post<User>(this.API_URL+"session",body.toString(),{ headers:headers,withCredentials:true} ));
  }

    createNewUser(username: string,email: string, password: string) {
       return( this.http.post(this.API_URL+"users", {"name": username,
                                                                "email": email,
                                                                "password": password}));


    }
    signOutUser() {

        const headers= new HttpHeaders({ 'Content-Type':  'application/x-www-form-urlencoded'});
        return( this.http.delete(this.API_URL+"session",{ headers:headers,withCredentials:true}) );
    };
  DeleteUser(id:string){

      return this.http.delete(this.API_URL+'users/'+id,{withCredentials:true})
  }


}
