import {Injectable} from '@angular/core';
import { HttpClient} from '@angular/common/http';
import {Subject} from 'rxjs';
import {Position} from '../models/position.model';


@Injectable({
  providedIn: 'root'
})
export class PositionService {
  positions: Position[] = [];
  positionSubject = new Subject<Position[]>();

  API_URL: string = 'http://52.232.22.124/api/';

  constructor(private http: HttpClient) {
  }


  emitPositions() {
    this.positionSubject.next(this.positions);
  }

  getPositions(){

    this.http.get<Position[]>(this.API_URL+'positions',{withCredentials:true}).subscribe(
        (data:Position[])=>{if (data.length > 0){ this.positions=data;} else {this.positions = [];}
                                      this.emitPositions();},
        (err)=> {console.log("err when getting data");
                       console.log(err);},
        ()=>{console.log("getting data with success");}
    );
  }

}
