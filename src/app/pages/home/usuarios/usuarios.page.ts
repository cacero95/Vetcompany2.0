import { Component, OnInit } from '@angular/core';
import { DbaService } from '../../../services/dba.service';
import { Users, Veterinarias } from '../../../models/usuarios/user_pets';
import { Platform, PopoverController, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { VetEventComponent } from 'src/app/components/vet-event/vet-event.component';
import { EmailComposer } from '@ionic-native/email-composer/ngx';
@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.page.html',
  styleUrls: ['./usuarios.page.scss'],
})
export class UsuariosPage implements OnInit {
  usuarios:Users[] = [];
  vet:Veterinarias;
  constructor(private dba: DbaService,
     private platform:Platform,
     private router:Router,
     private pop:PopoverController,
     private alert:AlertController,
     private emailComposer: EmailComposer) { }

  ngOnInit() {
    this.vet = this.dba.getUsuario();
    if (!this.vet){
      this.router.navigate(['login']);
    }
    else {
      this.usuarios = this.vet.users;
    }
    this.platform.ready().then(()=>{
    })
  }
  back(){
    this.router.navigate(['home']);
  }
  async cargar_usuario(user:Users){
    let mail = user.email;
    mail = mail.replace("@","_");
    while(mail.indexOf(".") != -1){
      mail = mail.replace(".","_");
    } 
     
    await this.dba.cargar_usuario(mail)
    .subscribe((data:any)=>{
      console.log((data));
      user = data.usuario;  
    })
    return user;
  }
  async add_marketing(usuario:Users){
    let user:any = await this.cargar_usuario(usuario);
    let pop = await this.pop.create({
      component:VetEventComponent
    });
    pop.present();
    const { data } = await pop.onDidDismiss();
    if (data){ // esto rectifica que el pop
      // arrojo un valor
      console.log(data.nuevo.email);
      let mail = data.nuevo.email;
          mail = data.nuevo;
          mail = mail.replace("@","_");
          while(mail.indexOf(".") != -1){
            mail = mail.replace(".","_");
          }
      this.dba.buscar_info(`tokens/${mail}`);
      if (this.platform.is('cordova')){
        
        let email = {
          to: mail,
          cc: 'cacero95@hotmail.com',
          subject: data.nuevo.title,
          body: `Desde el ${data.nuevo.startTime} hasta el ${data.nuevo.endTime}
            ${data.nuevo.description}
          `,
          isHtml: true
        }
        
        // Send a text message using default options
        this.emailComposer.open(email);
      
      }
      else {
        let alert = await this.alert.create({
          header:'Instalar en el mobile',
          subHeader:'Para usar todas las',
          message:'Funciones',
          buttons:['Aceptar']
        });
        alert.present();  
      }
      if(usuario.tasks){
        usuario.tasks.push(data.nuevo);
      }
      else {
        usuario.tasks = [];
      }
      this.dba.publicar_info(user,user.email,'usuarios')
    }
  }

}
