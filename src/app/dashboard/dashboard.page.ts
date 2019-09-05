import {Component, ViewChild, ElementRef, OnInit, OnDestroy, ChangeDetectorRef} from '@angular/core';
import {MenuController} from '@ionic/angular';
import {ToastController, Platform, LoadingController} from '@ionic/angular';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import leaflet,{marker } from 'leaflet';
import {PositionService} from '../providers/position.service';
import {Position} from '../models/position.model';
import {Subject, Subscription} from 'rxjs';
import {Device} from '../models/device.model';
import {DeviceService} from '../providers/device.service';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {NavigationExtras, Router} from '@angular/router';
import 'leaflet.awesome-markers'




@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements  OnDestroy,OnInit{

    redMarker =leaflet.AwesomeMarkers.icon({
        icon: 'home',
        markerColor: 'red'
    });
    greenMarker =leaflet.AwesomeMarkers.icon({
        icon: 'home',
        markerColor: 'green'
    });
    orangeMarker =leaflet.AwesomeMarkers.icon({
        icon: 'home',
        markerColor: 'orange'
    });


    socket = new WebSocket('ws://52.232.22.124/api/socket');
    private   subscription :Subscription ;
    private   PositionSubscription: Subscription;

    @ViewChild('map') mapContainer: ElementRef;
    devices: Device[] = [];
    devices_for_status:Device[]=[];
    positions: Position[];
    map: any;
    findme:boolean=false;
    loading: any;
    latitude: any;
    longitude: any;
    user_marker :any  = leaflet.marker([36.8312625,10.2306552]);
    circle=leaflet.circle([36.8312625,10.2306552]);
    green_flag_for_marekrs: boolean =false ;
    markers = new Map();


    constructor(private menu :MenuController,
                private geolocation: Geolocation,
                private platform: Platform,
                private position :PositionService,
                private changeRef: ChangeDetectorRef,
                private device: DeviceService,
                private http :HttpClient,
                public toastCtrl: ToastController,
                private router: Router
    )                    {

                        this.menu.enable(true);




    }


    goEmit_Positions(){
        this.PositionSubscription = this.position.positionSubject.subscribe(
            (positions: Position[]) => {
                console.log("we are in goEmit_positions");
                this.positions = positions;
                this.addMarkers_devices();


            }
        );
    }

    ngOnInit() {

    }



   async ionViewDidEnter() {
        await this.get_data();
        await  this.loadmap();
        await this.addMarker_user();
        await this.position.getPositions();
        await this.goEmit_Positions()

    }


    loadmap() {

        var container = leaflet.DomUtil.get('map');
        if(container != null){
            container._leaflet_id = null;
        }
         // the green_flag_for_marekrs is to triger the work of web socket on markers
        this.green_flag_for_marekrs=true;

        console.log("dans load maps");
        this.map = leaflet.map("map").fitWorld();
        leaflet.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attributions: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
            maxZoom: 19
        }).addTo(this.map);
        this.map.setView([36.8312625,10.2306552],12);
        this.map.addLayer(this.user_marker);
        this.map.addLayer(this.circle);

    }
    Find_Me(){
        if(this.findme){
        this.map.flyTo([this.latitude,this.longitude],19);
    }
    }

    addMarker_user(){
        let options = {
            enableHighAccuracy: true,
            timeout: 30000,
            maximumAge: 60000
        };
        console.log("dans add user marker");

        this.subscription= this.geolocation.watchPosition(options).subscribe((data)=>{

            this.latitude=data.coords.latitude;
            this.longitude=data.coords.longitude;
            this.findme=true;
            console.log(this.longitude,this.latitude);

            this.user_marker.setLatLng([data.coords.latitude,data.coords.longitude]);
            this.circle.setLatLng([data.coords.latitude,data.coords.longitude]).addTo(this.map);



        })
    }

    addMarkers_devices(){
        if(this.positions!=undefined) {
            console.log("dans add markers");

            this.positions.forEach((obj) => {
                this.devices.forEach((device)=>{
                    if(device.id===obj.deviceId){
                        if(device.status==="online"){
                            let marker: any = leaflet.marker([obj.latitude, obj.longitude],{icon:this.greenMarker});
                            marker.bindPopup("My charge is " + obj.attributes.batteryLevel.toString()+"%").openPopup();
                            this.markers.set(obj.deviceId, marker);
                        }
                        if(device.status==="offline"){
                            let marker: any = leaflet.marker([obj.latitude, obj.longitude],{icon:this.redMarker});
                            marker.bindPopup("My charge is " + obj.attributes.batteryLevel.toString()+"%").openPopup();
                            this.markers.set(obj.deviceId, marker);
                        }

                        if(device.status==="unknown"){
                            let marker: any = leaflet.marker([obj.latitude, obj.longitude],{icon:this.orangeMarker});
                            marker.bindPopup("My charge is " + obj.attributes.batteryLevel.toString()+"%").openPopup();
                            this.markers.set(obj.deviceId, marker);
                        }
                    }

                });

            });
            if(this.markers.values()!=undefined) {
                Array.from( this.markers.values() ).forEach((obj) => {
                    if(obj!=undefined) {

                        obj.addTo(this.map);

                    }
                });
            }
        }
        else { this.showToast("Please reload the page, " +
            "can't get devices position");}
    }


    get_data(){
        // to get devices then we will open web socket to update posiotns's devices
        this.http.get<Device[]>('http://52.232.22.124/api/devices',{withCredentials:true}).subscribe(
            (data:Device[])=>{this.devices=data;

                this.openWebsocket();
            },
            (err)=>{console.log(err)},
            ()=>{console.log("all is good ");

            });
    }

    goViewdetails(id:string){


            this.router.navigate(['details'+ '/' + id]);
    }

    getColor(appareilStatus:string) {
        if(appareilStatus === 'online') {
            return 'greenyellow';
        } else if(appareilStatus === 'offline') {
            return 'red';
        }else if(appareilStatus === 'unknown'){
            return 'orange';
        }
    }
    openWebsocket() {
        let _self = this;

        _self.socket.onopen = function() {
            console.log("onopen");
        };
        _self.socket.onclose = function(event) {
            console.log("WebSocket closed")
        };
        _self.socket.onerror = function(event) {
            console.log("WebSocket on error");

            console.log(event);
        };
        _self.socket.onmessage = function(event) {
            var data = JSON.parse(event.data);
            if(data.devices!=undefined) {
                if (data.devices.length > 0) {
                    console.log(data.devices);
                    _self.devices.forEach((obj) => {
                        data.devices.forEach((obj1) => {
                            if (obj1.uniqueId === obj.uniqueId) {
                                obj.status = obj1.status;
                            }
                            if (_self.markers.has(obj1.id)!=false){
                                if(obj1.status==='online'){_self.markers.get(obj1.id).setIcon(_self.greenMarker);}
                                if(obj1.status==='offline'){_self.markers.get(obj1.id).setIcon(_self.redMarker);}
                                if(obj1.status==='unknown'){_self.markers.get(obj1.id).setIcon(_self.orangeMarker);}
                            }

                        });

                    });
                }
            }
            if (data.positions){
                if ( _self.green_flag_for_marekrs===true &&_self.markers!=undefined){
                    if(_self.markers.size>0){
                    console.log(data.positions,"dans la websocekt");
                    data.positions.forEach((obj:Position)=>{

                        if (_self.markers.has(obj.deviceId)===false){
                            let marker: any = leaflet.marker([obj.latitude, obj.longitude],{icon:_self.greenMarker});
                            marker.bindPopup("My charge is " + obj.attributes.batteryLevel+"%").openPopup();
                            marker.addTo(_self.map);
                            _self.markers.set(obj.deviceId, marker);


                        }
                        else{
                        _self.markers.get(obj.deviceId).setLatLng([obj.latitude,obj.longitude]);
                        _self.markers.get(obj.deviceId).setIcon(_self.greenMarker);
                        _self.markers.get(obj.deviceId).setPopupContent("My charge is " + obj.attributes.batteryLevel+"%");


                        }
                    })



                }}
            }
        };

    }

    ionViewWillLeave() {
      // this.map.remove();
       this.subscription.unsubscribe();
       this.green_flag_for_marekrs=false;
       this.findme=false;
       this.markers.clear();
       console.log("out of the page .......");
    }

    ngOnDestroy(){
        this.green_flag_for_marekrs=false;

    }

    async showToast(message: string) {
        const toast = await this.toastCtrl.create({
            message: message,
            duration: 2000,
            position: 'bottom',
            color: 'danger'
        });

        toast.present();
    }




}










