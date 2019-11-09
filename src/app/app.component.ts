import { Component } from '@angular/core';

import { Platform, ModalController, Events } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Router } from '@angular/router';
import { TypeUserComponent } from './components/type-user/type-user.component';

import { FCM } from '@ionic-native/fcm/ngx';
import { DbaService } from './services/dba.service';
import { Users } from './models/usuarios/user_pets';
import { Storage } from '@ionic/storage';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {

  usuario:Users;
  select_menu = 0;
  menuVet = [
    {title:'Principal', url:'/home', icon:'home'},
    {title:'Calendario', url:'/calendar', icon:'calendar'},
    {title:'Mensajes', url:'/notificaciones',icon:'chatbubbles'},
    {title:'Usuarios', url:'/usuarios', icon:'people'},
    {title:'Enterate', url:'',icon:'quote'},
    {title:'Cuenta', url:'account', icon:'contact'}
  ]
  menuUser = [
    {title:'Tu mascota', url:'/rastreo', icon:'locate'},
    {title:'Calendario', url:'/calendar', icon:'calendar'},
    {title:'Mensajes', url:'/notificaciones',icon:'chatbubbles'},
    {title:'Veterinarias',url:'/veterinarias',icon:'paw'},
    {title:'Principal', url:'/home', icon:'home'},
    {title:'Enterate', url:'',icon:'quote'},
    {title:'Cuenta', url:'account', icon:'contact'}
  ];
  appMenu = [
    
    {title: 'Entrar', url: '/login', icon: 'md-contact'},
    {title: 'Registrarse', url:'/registrarse', icon:'md-arrow-round-up'}
    
  ];
  status = 'no';
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private router:Router,
    private modal:ModalController,
    private eventos:Events,
    private fcm:FCM,
    private dba:DbaService,
    private storage:Storage
  ) {
    this.initializeApp();
    this.menu_update();
  }
  menu_update(){
    this.eventos.subscribe("login",(user)=>{
      if (this.platform.is('cordova')){
        let token = this.storage.get("token");
        if (token){
          let email:string = user.email;
          email = email.replace("@","_");
          while(email.indexOf(".") != -1){
            email = email.replace(".","_");
          }
          this.dba.push_contenido(token,`tokens/${email}`);
        }
      }
      if (user.type == 'institute'){
        this.select_menu = 2;
      }
      else {
        this.select_menu = 1;
      }
    })
    this.eventos.subscribe("close_sesion",()=>{
      this.select_menu = 0;
    })
  }
  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
    if (this.platform.is('cordova')){
      this.fcm.getToken() // token que se le designa a mobile 
        .then((token:string)=>{
          console.log(`token del dispositivo es ${token}`);
          this.storage.set("token",token);
        }).catch(err=>{
          console.log(JSON.stringify(err));
        })
        this.fcm.onTokenRefresh().subscribe((token:string)=>{
          console.log(`se actualizo el token mira ${token}`);
          this.storage.set("token",token);
        });
        
        this.fcm.onNotification().subscribe( data =>{
          if(data.wasTapped){ // indica si la aplicacion esta en segundo plano
            console.log(`estoy en segun plano`);
            console.log(data);
          }
          else {
            // significa que la aplicacion esta en primer plano
            console.log(`èstoy en primer plano`);
            console.log(data);
          }
        },err=>{
          console.log(JSON.stringify(err));
        })
    }
  }
  async navegar(url){
    
    switch (url){
      case '/registrarse':
        let modal = await this.modal.create({
          component:TypeUserComponent
        });
        modal.present();
        const {data} = await modal.onDidDismiss();
        
        if(data.salida == 'institute'){
          this.router.navigate(['/vet-registro']);

        }
        else {
          console.log(data.salida);
          this.router.navigate(['/registrar'])
        }
        
      break; 
      default:
        this.router.navigate([`/${url}`]);
    }
  }
}
