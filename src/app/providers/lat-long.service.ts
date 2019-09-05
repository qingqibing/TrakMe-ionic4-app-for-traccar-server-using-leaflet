import { Injectable } from '@angular/core';
import {Position} from '../models/position.model';
import {Subject} from 'rxjs';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LatLongService {

  positions: Position[] = [];
  positionSubject = new Subject<Position[]>();

  API_URL: string = 'http://52.232.22.124/api/';

  constructor(private http:HttpClient) { }



  emitPositions() {
    this.positionSubject.next(this.positions);
  }



  get_position_History(id: string){
    this.http.get(this.API_URL+'positions',{params:{'deviceId':id
        ,'from':this.get_lastDay(),
         'to' : this.get_nextDay() },
      withCredentials:true  })
        .subscribe(
            (data:Position[])=>
            {if (data.length > 0){ this.positions=data;}
            else {this.positions = [];
            }
              this.emitPositions();
            },
            (err)=> {console.log("err when getting data");
              console.log(err);},
            ()=>{console.log("getting data with success");});

  }
  get_lastDay(){
    let myDate = new Date();
    let  yyyy=myDate.getFullYear();
    let mm=myDate.getMonth()+1;
    let j =myDate.getDate();



    if(mm===1 &&j===1 ){
      return  (yyyy-1).toString()+'-'+'12'+'-'+'31'+'T00:00:00Z';

    }
    if(mm===3&& j===1){
      return (yyyy).toString()+'-'+'02'+'-'+'29'+'T00:00:00Z';
    }
    if ( ([1,3,5,7,8,10].indexOf(mm))!=-1 &&(j===1)){
      return (yyyy).toString()+'-0'+(mm-1).toString()+'-'+'30'+'T00:00:00Z';
    }

    if( ([2,4,6,9,11].indexOf(mm))!=-1 &&(j===1)){
      if (mm===11){ return (yyyy).toString()+'-10-31'+'T00:00:00Z';  }

      return (yyyy).toString()+'-0'+(mm-1).toString()+'-'+'31'+'T00:00:00Z';
    }
    let month=mm.toString();
    if(month.length===1){month='0'+month}
    let jour=(j-1).toString();
    if(jour.length===1){jour='0'+jour}
    return (yyyy).toString()+'-'+month+'-'+jour+'T00:00:00Z';

  }

  get_nextDay(){

    let myDate = new Date();
    let  yyyy=myDate.getFullYear();
    let mm=myDate.getMonth()+1;
    let j =myDate.getDate();

    if(mm===12 &&j===31 ){
      return (yyyy+1).toString()+'-'+'01'+'-'+'01'+'T00:00:00Z';

    }
    if(mm===2&& j===29){
      return (yyyy).toString()+'-03-01T00:00:00Z';

    }
    if (([1,3,5,7,8,10].indexOf(mm))!=-1&&(j===31)){
      if(mm===10){return (yyyy).toString()+'-11-01T00:00:00Z';}

      return (yyyy).toString()+'-0'+(mm+1).toString()+'-01T00:00:00Z';


    }

    if( ([2,4,6,9,11].indexOf(mm))!=-1 &&(j===30) ){
      if((mm===11) || (mm===9)){return (yyyy).toString()+'-'+(mm+1).toString()+'-01T00:00:00Z'}
      else
        return (yyyy).toString()+'-0'+(mm+1).toString()+'-01T00:00:00Z';

    }
    let month=mm.toString();
    if(month.length===1){month='0'+month}
    let jour=(j+1).toString();
    if(jour.length===1){jour='0'+jour}
    return (yyyy).toString()+'-'+month+'-'+jour+'T00:00:00Z';

  }
}
