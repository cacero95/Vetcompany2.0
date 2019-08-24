import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Veterinarias } from 'src/app/models/usuarios/user_pets';
import { ImagePicker,ImagePickerOptions } from '@ionic-native/image-picker/ngx';

// firebase 
import { AngularFireAuth } from '@angular/fire/auth';
import { AlertController } from '@ionic/angular';
import { DbaService } from '../../../services/dba.service';

@Component({
  selector: 'app-vet-registro',
  templateUrl: './vet-registro.page.html',
  styleUrls: ['./vet-registro.page.scss'],
})
export class VetRegistroPage implements OnInit {
  vet = {} as Veterinarias;
  image64:string;
  imagePreview:string;
  password:string;
  services:any[] = [];
  servicios = [
    {
      nombre: 'Guarderia',
      img: 'assets/img/home.png'
  },
  {
      nombre: 'Peluqueria',
      img: 'assets/img/tijeras.png'
  },
  {
      nombre: 'Urgencias',
      img: 'assets/img/warning.jpg'
  },
  {
      nombre: 'Veterinaria',
      img: 'assets/img/veterinaria.png'
  },
  {
      nombre: 'Hotel mascotas',
      img: 'assets/img/hotel.png'
  },
  {
      nombre: 'Transporte mascotas',
      img: 'assets/img/warning.jpg'
  }
];
  constructor(private router:Router,
    private imagePicker:ImagePicker,
    private alert:AlertController,
    private fire_auth:AngularFireAuth,
    private dba:DbaService) { }

  ngOnInit() {
  }
  image(){
    const options:ImagePickerOptions = {
      quality: 70,
      outputType: 1, // indica que la imagen va ser en base 64bits
      maximumImagesCount:1
    };
    this.imagePicker.getPictures(options).then((results)=>{
      for (var i = 0; i < results.length; i++){
        this.imagePreview = 'data:image/jpeg;base64,' + results[i];
        this.image64 = results[i];
        
        
      }
    },(err)=>console.log(JSON.stringify(err)))
  }
  visitar(url){
    this.router.navigate([`/${url}`]);
  }
  setServices(servicio){
    console.log(this.services);
    let pos = this.services.indexOf(servicio);
    if (pos == -1){
      // se agrega el servicio
      this.services.push(servicio);
    }
    else{
      this.services.splice(pos);
      // se elimina el servicio
    }
    console.log(this.services);  
  }

  registrar(){
    this.vet.type = 'institute';
    if (this.services.length > 0){
      this.vet.services = this.services;
    }
    
    while(this.vet.email.indexOf(" ") != -1){
      this.vet.email = this.vet.email.replace(" ","");  
    }

    this.fire_auth.auth.createUserWithEmailAndPassword(this.vet.email,this.password).then(()=>{
      let upload = this.dba.registrar_vet(this.vet);
      if(upload){
        this.router.navigate(['/tabs/home']);
      }
      else {
        this.show_message(':(','No se registro el usuario');
      }
    }).catch((err)=>{
      this.show_message(':(', err.mensaje);
    })
    
  }
  async show_message(title:string,mensaje:string){
    let alert = await this.alert.create({
      header:title,
      subHeader:mensaje,
      buttons:['confirmar']
    });
    alert.present();
  }
}
