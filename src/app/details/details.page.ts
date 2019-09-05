import {ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Router,ActivatedRoute} from '@angular/router';
import {Subscription} from 'rxjs';
import {Position} from '../models/position.model';
import leaflet,{icon} from 'leaflet';
import {LatLongService} from '../providers/lat-long.service';
import {LoadingController, ToastController} from '@ionic/angular';


@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
})


export class DetailsPage implements OnInit {

    //@ViewChild('map1') mapContainer: ElementRef;
    private   PositionSubscription: Subscription;
    id :string;
    positions: Position[];
    map :any;
    latlongs:any[] = [];
    loading: any;

    constructor(private http :HttpClient,
                private router: Router,
                private route: ActivatedRoute,
                private latlong :LatLongService,
                private changeRef: ChangeDetectorRef,
                public toastCtrl: ToastController,
                public loadingCtrl: LoadingController,) {

               this.id=this.route.snapshot.params['id'];
               console.log(this.id);

    }

  ngOnInit() {


  }
    async ionViewDidEnter() {
        await this.loadmap();
        await this.latlong.get_position_History(this.id);

        await  this.goEmit_Positions();


    }
     goEmit_Positions(){



        this.PositionSubscription = this.latlong.positionSubject.subscribe(
            async (positions: Position[]) => {

                this.loading = await this.loadingCtrl.create({
                    message: 'Please wait...'
                });
                await this.loading.present();

                console.log("we are in goEmit_positions");
                this.positions = positions;
                this.positions.forEach(obj=>{
                   this.latlongs.push([obj.latitude,obj.longitude]);
                });

                if(this.latlongs.length>1) {
                    this.loading.dismiss();
                    let ployline = leaflet.polyline(this.latlongs);
                    this.map.addLayer(ployline);
                    let latlong = this.latlongs[this.latlongs.length - 1];
                    let marker =leaflet.marker(latlong);
                    let charge:string=this.positions[(this.positions.length-1)].attributes.batteryLevel.toString();
                 //   marker.setPopupContent(charge).openPopup;
                    marker.bindPopup("My charge is " + charge+"%").openPopup();
                    marker.addTo(this.map);
                  //  marker.setPopupContent("10%");

                    //leaflet.marker(latlong).addTo(this.map);
                    this.map.setView(latlong, 16);
                }
                else {
                    this.loading.dismiss();
                    this.showToastFail("there is no data yet please connect your device");
                }
            }

        );
    }
    loadmap()
     {
        var container = leaflet.DomUtil.get('map1');
        if(container != null){
            container._leaflet_id = null;
        }
        console.log("dans load page");
        this.map = leaflet.map("map1").fitWorld();
        leaflet.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attributions: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
            maxZoom: 19,
        }).addTo(this.map);
        this.map.setView([36.8312625,10.2306552],12);
    }

    ionViewWillLeave() {
        this.PositionSubscription.unsubscribe();

    }
    ngOnDestroy(){

    }

    get_back(){
        this.router.navigate(['dashboard']);

    }

    async showToastFail(message: string) {
        const toast = await this.toastCtrl.create({
            message: message,
            duration: 4000,
            position: 'middle',
            color: 'danger'
        });

        toast.present();
    }
}
