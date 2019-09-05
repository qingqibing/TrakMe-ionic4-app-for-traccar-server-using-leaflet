import {Injectable, OnDestroy, OnInit} from '@angular/core';
import { HttpClient, HttpParams,HttpHeaders} from '@angular/common/http';
import {Subject, Subscription} from 'rxjs';
import {Device} from '../models/device.model';

@Injectable({
  providedIn: 'root'
})
export class DeviceService {

  devices: Device[] = [];
  devicesSubject = new Subject<Device[]>();

  API_URL : string ='http://52.232.22.124/api/';

  constructor(private http: HttpClient)  {

  }


  emitDevices() {
    this.devicesSubject.next(this.devices);
  }

  getDevices(){
      this.http.get<Device[]>(this.API_URL+"devices",{withCredentials:true}).subscribe(

           (data) => {
             console.log("we are in getDevices");
             if(data.length>0){this.devices=data;}
             else {this.devices=[]}
             this.emitDevices();
             },
           (err)=>{console.log(err);},
           ()=>{console.log("all is fine");
                         }
       )
  }

  create_New_device( name :string ,uniqueId:number ){
    return(
        this.http.post(this.API_URL+"devices",{"name":name, "uniqueId":uniqueId},{withCredentials:true}) )

  }

  deleteDevice(id :number){

      this.http.delete(this.API_URL+'devices/'+id.toString(),{withCredentials:true}).subscribe(
          (data)=>{console.log(data);},
          (err)=> {console.log(err)},
          ()=>{ this.getDevices();
              console.log('device deleted');}
      )
  }



}
