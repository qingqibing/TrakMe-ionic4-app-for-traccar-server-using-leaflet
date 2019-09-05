import {Component, OnDestroy, OnInit, ChangeDetectorRef, ChangeDetectionStrategy} from '@angular/core';
import {AlertController, LoadingController, ToastController} from '@ionic/angular';
import { HttpClient, HttpParams,HttpHeaders} from '@angular/common/http';
import {DeviceService} from '../providers/device.service';
import {Device} from '../models/device.model';
import 'rxjs-compat/add/operator/map';
import {Subscription} from 'rxjs';
import {Router} from '@angular/router';



@Component({
  selector: 'app-devices',
  templateUrl: './devices.page.html',
  styleUrls: ['./devices.page.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,

})
export class DevicesPage implements OnInit ,OnDestroy {
    devices: Device[];
    DeviceSubscription: Subscription;
    device_Name: string;
    device_ID: number;
    loading: any;

    constructor(private alertCtrl: AlertController,
                public loadingCtrl: LoadingController,
                public toastCtrl: ToastController,
                private http: HttpClient,
                private device: DeviceService,
                private changeRef: ChangeDetectorRef,
                private router: Router) {
        console.log("the construnctor");
        this.device.getDevices();
        this.goEmit_devices();
    }



    onDelete_device(id:number){
         this.device.deleteDevice(id);
    }


    ngOnInit() {}

    getColor(appareilStatus:string) {
        if(appareilStatus === 'online') {
            return 'greenyellow';
        } else if(appareilStatus === 'offline') {
            return 'red';
        }else if(appareilStatus === 'unknown'){
            return 'orange';
        }
    }

    goEmit_devices() {
        this.DeviceSubscription = this.device.devicesSubject.subscribe(
            (devices: Device[]) => {
                console.log(devices);
                console.log("we are in goEmit_devices");
                this.devices = devices;
                if (!this.changeRef['destroyed']) {
                    this.changeRef.detectChanges();
                }

            }
        );
    }


    async add_device() {
        let alert = await this.alertCtrl.create({
            header: 'Add Device',
            inputs: [
                {
                    name: 'device_name',
                    placeholder: 'Device name',
                    type: 'text'
                }, {

                    name: 'device_id',
                    placeholder: 'Device unique ID (only numbers)',
                    type: 'number',
                },
            ],
            buttons: [
                {
                    text: 'Cancel',
                    handler: data => {
                        console.log('Cancel clicked');
                    }
                },
                {
                    text: 'Save',
                    handler: data => {
                        this.go_add_device(data.device_name, data.device_id);
                    }
                }
            ]
        });
        await alert.present();
    }


    async go_add_device(name: string, id: string) {

        this.loading = await this.loadingCtrl.create({
            message: 'Please wait...'
        });
        await this.loading.present();

        this.device_Name = name;
        this.device_ID = Number(id);
        this.device.create_New_device(this.device_Name, this.device_ID).subscribe(
            (data) => {

            },
            (err) => {
                this.loading.dismiss();
                this.showToastFail(err['error'].substring(0, 25));
            },
            () => {
                this.device.getDevices();
                this.goEmit_devices();
                this.loading.dismiss();
                this.showToastAllgood("Your Device Registred");

            });
    }

    async showToastFail(message: string) {
        const toast = await this.toastCtrl.create({
            message: message,
            duration: 2000,
            position: 'middle',
            color: 'danger'
        });

        toast.present();
    }

    async showToastAllgood(message: string) {
        const toast = await this.toastCtrl.create({
            message: message,
            duration: 2000,
            position: 'middle',
            color: 'success'
        });

        toast.present();
    }

    route(device_id:number){
        this.router.navigate(['route'+ '/' + device_id]);
    }

    ionViewWillLeave(){



    }
    ngOnDestroy() {

        this.DeviceSubscription.unsubscribe();

    }
}

