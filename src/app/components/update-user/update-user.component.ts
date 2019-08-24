import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams, Platform, AlertController } from '@ionic/angular';
import { Veterinarias,User_pets } from 'src/app/models/usuarios/user_pets';
import { ImagePicker,ImagePickerOptions } from '@ionic-native/image-picker/ngx';
@Component({
  selector: 'app-update-user',
  templateUrl: './update-user.component.html',
  styleUrls: ['./update-user.component.scss'],
})
export class UpdateUserComponent implements OnInit {
  imagePreview:string;
  image64:string;
  usuario:User_pets;
  vet:Veterinarias;
  is_image = false;
  services = [];
  servicios = [];
  constructor(private modal:ModalController,
    private navparams:NavParams,
    private image:ImagePicker,
    private platform:Platform,
    private alert:AlertController) { }

  ngOnInit() {
    let usuario = this.navparams.get('usuario');
    if (usuario.type == 'institute'){
      this.servicios = this.vet.services;
      this.vet = usuario;
      this.services = [
      {
          nombre: 'guarderia',
          img: 'assets/img/home.png',
          tick: false
      },
      {
          nombre: 'peluqueria',
          img: 'assets/img/tijeras.png',
          tick: false
      },
      {
          nombre: 'urgencias',
          img: 'assets/img/warning.jpg',
          tick: false
      },
      {
          nombre: 'veterinaria',
          img: 'assets/img/veterinaria.png',
          tick: false
      },
      {
          nombre: 'hotel mascotas',
          img: 'assets/img/hotel.png',
          tick: false
      },
      {
          nombre: 'transporte mascotas',
          img: 'assets/img/warning.jpg',
          tick: false
      }
      ];
      let index = 0;
      for (let service of this.services){
        let find = this.vet.services.find((element)=>{
          return element === service.nombre
        });
        if(find){
          this.services[index].tick = true;
        }
        index = index+1;
      }
    }
    else {
      this.usuario = usuario;
      console.log(this.usuario);
    }
  }
  async change_image(posicion){
    console.log('hola');
    if(this.platform.is('cordova')){
      const options:ImagePickerOptions = {
        quality: 70,
        outputType: 1, // indica que la imagen va ser en base 64bits
        maximumImagesCount:1
      };
      this.image.getPictures(options).then((results)=>{
        for (var i = 0; i < results.length; i++){
          this.imagePreview = 'data:image/jpeg;base64,' + results[i];
          this.image64 = results[i];
          this.is_image = true;  
          
        }
      },(err)=>console.log(JSON.stringify(err))).then(()=>{
        if(this.is_image){
          this.usuario.mascotas[posicion].url = this.image64;
        }
      })
    }
    else {
      console.log(posicion);
      let alert = await this.alert.create({
        header:'Se encuentra en un servidor web',
        subHeader:'Por favor instalar el app',
        message:'En un mobile',
        buttons:['Confirmar']
      });
      alert.present();
    }
  }
  add_item(servicio){
    let find = this.servicios.findIndex((element)=>{
      return element === servicio
    });
    if(find == -1){
      this.servicios.push(servicio);
    }
    else {
      this.servicios.splice(find);
    }
  }  
  back(){
    this.modal.dismiss({
      'salida':false
    });
  }

  update_pet(){
    
  }
  update_vet(){

  }
}
