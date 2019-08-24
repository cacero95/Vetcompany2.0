import { Component, OnInit } from '@angular/core';
import { ImagePicker, ImagePickerOptions } from '@ionic-native/image-picker/ngx';
import { Platform, AlertController, ModalController, PopoverController } from '@ionic/angular';
import { DbaService } from '../../services/dba.service';
import { Publicaciones } from '../../models/social/twitter_model';
import { ImagenPublicacionComponent } from '../imagen-publicacion/imagen-publicacion.component';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss'],
})
export class EventComponent implements OnInit {
  publicacion:Publicaciones;
  image64:string;
  imagePreview:string;
  default_image:string;
  constructor(private image:ImagePicker,
    private platform:Platform,
    private alert:AlertController,
    private dba:DbaService,
    private modal:ModalController,
    private pop:PopoverController) { }

  ngOnInit() {
    this.platform.ready().then(()=>{
      this.default_image = 'assets/img/add_photo.png';
    })
  }
  publicar(){
    if (this.image64){
       let is_address = this.dba.publicar_imagen(this.image64)
       console.log(is_address);
    }

  }
  async push_image(){
    if (this.platform.is('cordova')){
      const options:ImagePickerOptions = {
        quality: 70,
        outputType: 1, // indica que la imagen va ser en base 64bits
        maximumImagesCount:1
      };
      this.image.getPictures(options).then((results)=>{
        for (var i = 0; i < results.length; i++){
          this.chekear_imagen(results[i]);
        }
      },(err)=>console.log(JSON.stringify(err)))
    }
    else {
      let alert = await this.alert.create({
        header:'Instale el app en el Mobile',
        subHeader:'Para usar el servicio',
        message:'De cambio de imagenes'
      });
      alert.present();
    }
  }
  async chekear_imagen(imagen){
    let pop = await this.pop.create({
      component:ImagenPublicacionComponent,
      componentProps:{
        imagen
      }
    });
    pop.present();
    const {data} = await pop.onDidDismiss();
    if (data.confirmacion == true){      
      this.imagePreview = 'data:image/jpeg;base64,' + imagen;
      this.publicacion.imagen = imagen;
    }
  }
  close(){
    this.modal.dismiss();
  }
}
