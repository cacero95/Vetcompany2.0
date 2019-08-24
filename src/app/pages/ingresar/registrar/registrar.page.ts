import { Component, OnInit } from '@angular/core';
import { User_pets } from 'src/app/models/usuarios/user_pets';
import { Router } from '@angular/router';
import { ModalController, AlertController } from '@ionic/angular';
import { MascotasPage } from './mascotas/mascotas.page';

import { AngularFireAuth } from '@angular/fire/auth';
import { DbaService } from '../../../services/dba.service';

@Component({
  selector: 'app-registrar',
  templateUrl: './registrar.page.html',
  styleUrls: ['./registrar.page.scss'],
})
export class RegistrarPage implements OnInit {
  user = {} as User_pets;
  is_mascotas = false;
  password:string;
  constructor(private router:Router,
    private modal:ModalController,
    private dba:DbaService,
    private alert:AlertController,
    private auth:AngularFireAuth
    ) { }

  ngOnInit() {
  }

  registrar(){
    this.user.type = "mascota";
    let correo = this.user.email;
     
      while(correo.indexOf(" ") != -1){
        correo = correo.replace(" ","");
      }
    try {
      
      this.auth.auth.createUserWithEmailAndPassword(correo,this.password)
      .then(async()=>{
        let upload = await this.dba.registrar_pets(this.user,this.is_mascotas);

        if (upload){
          this.router.navigate([`/tabs/home`]);
        }
        else {
          this.crear_mensaje('Error :(', 'al registrar');
        }
      })
    }
    catch(err) {
      this.crear_mensaje(':(', err.mensaje);
    }
    /**
     * 
     */
    
  }
  async mascotas(){
    let modal = await this.modal.create({
      component:MascotasPage
    })
    modal.present();

    const {data} = await modal.onDidDismiss();

    if (data.mascota){
      this.user.mascotas = data.mascota;
      
      if (data.mascota.imagen){
        this.is_mascotas = true;
      }
      
    }
  }

  async crear_mensaje(title:string,mensaje:string){
    let alert = await this.alert.create({
      header:title,
      subHeader:mensaje,
      buttons:['confirmar']
    });
    alert.present();
  }
  visitar(url){
    this.router.navigate([`/${url}`]); 
  }
}
