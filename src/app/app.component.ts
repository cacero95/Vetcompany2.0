import { Component } from '@angular/core';

import { Platform, ModalController, Events } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Router } from '@angular/router';
import { TypeUserComponent } from './components/type-user/type-user.component';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {


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
    private eventos:Events
  ) {
    this.initializeApp();
    this.menu_update();
  }
  menu_update(){
    this.eventos.subscribe("login",(user)=>{
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
