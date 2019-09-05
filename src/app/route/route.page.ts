import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import  leaflet from'leaflet';
import {Subscription} from 'rxjs';
import 'leaflet.awesome-markers'
import 'leaflet-routing-machine';
import {PositionService} from '../providers/position.service';
import {Position} from '../models/position.model';
import {LoadingController, ToastController} from '@ionic/angular';

@Component({
  selector: 'app-route',
  templateUrl: './route.page.html',
  styleUrls: ['./route.page.scss'],
})
export class RoutePage  {
  redMarker =leaflet.AwesomeMarkers.icon({
    icon: 'home',
    markerColor: 'red'
  });

  //@ViewChild('map2') mapContainer: ElementRef;

  private   subscription :Subscription ;
  private   PositionSubscription: Subscription;

  positions:Position[]=[];
  routeControl:any;
  id:string;
  map: any;
  exitance:boolean=false;
  findme:boolean=false;
  latitude: any;
  longitude: any;
  loading: any;
  user_marker :any  = leaflet.marker([36.8312625,10.2306552],{icon:this.redMarker});
  circle=leaflet.circle([36.8312625,10.2306552],{color:'#CF3C29'});


  constructor(private router: Router,
              private route: ActivatedRoute,
              private geolocation: Geolocation,
              private position :PositionService,
              public loadingCtrl: LoadingController,
              public toastCtrl: ToastController,

  ) {

    this.id=this.route.snapshot.params['device_id'];
    console.log(this.id);
  }


  async ionViewDidEnter() {
    await this.loadmap();
    await this.addMarker_user();
    await this.position.getPositions();
    await this.goEmit_Positions();
  }
  loadmap() {

    var container = leaflet.DomUtil.get('map2');
    if(container != null){
      container._leaflet_id = null;
    }

    console.log("dans load maps");
    this.map = leaflet.map("map2").fitWorld();
    leaflet.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attributions: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
      maxZoom: 19
    }).addTo(this.map);
    this.map.setView([36.8312625,10.2306552],12);
    this.map.addLayer(this.user_marker);
    this.map.addLayer(this.circle);

  }

  async goEmit_Positions(){
    this.PositionSubscription = this.position.positionSubject.subscribe(


        async (positions: Position[]) => {

          this.loading = await this.loadingCtrl.create({
            message: 'Please wait...'
          });

          await this.loading.present();

          this.positions = positions;
          console.log(this.positions);
          this.positions.forEach(obj=>{
            if(obj.deviceId.toString()===this.id){
              this.exitance=true;
              this.load_route(obj.latitude,obj.longitude)

            }
          });
          if(!this.exitance){
            this.loading.dismiss();
          }


        }
    );
  }

  load_route(lat:number,lng:number){
    let options = {
      enableHighAccuracy: true,
      maxAge: 0,
      timeout: 5000,
    };

     this.geolocation.getCurrentPosition(options).then((resp) => {
       let waypoints = [
         leaflet.latLng(resp.coords.latitude,resp.coords.longitude),
         leaflet.latLng(lat,lng)
       ];

       this.routeControl=leaflet.Routing.control({

         plan: leaflet.Routing.plan(waypoints, {

           createMarker: function(i, wp) {
             if(i===0){
                  return leaflet.marker(wp.latLng );
               }
             else if(i===1){
               return leaflet.marker(wp.latLng);
             }

           }
         }),
         routeWhileDragging: false,
       }).on('routesfound', function(e) {
         var routes = e.routes;
       }).addTo(this.map);
       this.loading.dismiss();

     }).catch((error) => {
       this.loading.dismiss();
       console.log('Error getting location', error);
     });
  }


  addMarker_user(){
    let options = {
      enableHighAccuracy: true,
      maxAge: 0,
      timeout: 5000,
    };

    this.subscription= this.geolocation.watchPosition(options).subscribe((data)=>{

      this.latitude=data.coords.latitude;
      this.longitude=data.coords.longitude;
      this.findme=true;
      console.log(this.longitude,this.latitude);

      this.user_marker.setLatLng([data.coords.latitude,data.coords.longitude]);
      //this.user_marker.setIcon(this.redMarker);
      this.circle.setLatLng([data.coords.latitude,data.coords.longitude]);


    })
  }

  async showToast(message: string) {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: 4000,
      position: 'middle',
      color: 'danger'
    });
  }


    ionViewWillLeave() {
    this.PositionSubscription.unsubscribe();
    this.subscription.unsubscribe();
    this.findme=false;
    console.log("out of the page .......");
    this.loading.dismiss();

  }

}
