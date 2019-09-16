import { Component, OnInit } from '@angular/core';
import { ImagePicker, ImagePickerOptions } from '@ionic-native/image-picker/ngx';
import { Platform, AlertController, ModalController, PopoverController, NavParams } from '@ionic/angular';
import { DbaService } from '../../services/dba.service';
import { Publicaciones } from '../../models/social/twitter_model';
import { ImagenPublicacionComponent } from '../imagen-publicacion/imagen-publicacion.component';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { SocialService } from '../../services/social.service';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss'],
})
export class EventComponent implements OnInit {
  publicacion = {} as Publicaciones;
  image64:string;
  imagePreview:string;
  default_image:string;
  evento:Publicaciones;
  constructor(private image:ImagePicker,
    private platform:Platform,
    private alert:AlertController,
    private dba:DbaService,
    private modal:ModalController,
    private pop:PopoverController,
    private social:SocialSharing,
    private twitter:SocialService,
    private params:NavParams) { }

  ngOnInit() {
    this.platform.ready().then(()=>{
      this.default_image = 'assets/img/add_photo.png';
      this.publicacion.origen = this.params.get('usuario').email;
    })
  }
  publicar(mensaje:string){
    this.publicacion.mensaje = mensaje;
    if (this.image64){
       let is_address = this.dba.publicar_imagen(this.image64);
       this.evento.imagen = is_address;
    }
    if (mensaje.length > 0){
      this.social_sharing();
    }
  }
  async social_sharing(){
    let alert = await this.alert.create({
      animated:true,
      mode:'ios',
      header:'Publicar',
      subHeader:'Por',
      buttons:[
        {
          text:'Twitter',
          handler:()=>{
            this.sharing_twitter();
          }
        },
        {
          text:'Facebook',
          handler:()=>{
            this.sharing_facebook();
          } 
        },
        {
          text:'Correo',
          handler:()=>{
            this.sharing_mail();
          }
        },
        {
          text:'Cancelar',
          role:'Cancelar'
        }
      ]
    });
    alert.present();
    await alert.onDidDismiss().then(async()=>{
      let push_new = `publicaciones/${new Date()}`;
      this.dba.push_contenido(this.publicacion,push_new);
      await this.show_alert('Exito',':)');
      this.pop.dismiss();
    })
  }

  sharing_twitter(){
    console.log('funciona');
    this.twitter.publicar_noticia(this.publicacion);
  }

  sharing_facebook(){
    if (this.platform.is('cordova')){
      if (this.publicacion.imagen){
        this.social.shareViaFacebook(this.publicacion.mensaje,this.publicacion.imagen)
        .then(()=>{
          this.show_alert('Se publico','Con exito')
        }).catch(()=>{
          this.show_alert('Error :(','Al publicar')
        })
      }
    }
    else {
      this.social.shareViaFacebook(this.publicacion.mensaje)
        .then(()=>{
          this.show_alert('Se publico','Con exito')
        }).catch(()=>{
          this.show_alert('Error :(','Al publicar')
        })
    }
  }

  async sharing_mail(){
    if (this.platform.is('cordova')){
      let alert = await this.alert.create({
        header:'Manda un',
        subHeader:'Correo',
        inputs:[
          {
            type:'text',
            name:'destino',
            placeholder:'Para'
          },
          {
            type:'text',
            name:'subject',
            placeholder:'Asunto'
          }
        ],
        buttons:[
          {
            text:'Cancelar',
            role:'Cancelar'
          },
          {
            text:'Aceptar',
            role:'Aceptar',
            handler:(values)=>{
              if(this.publicacion.imagen){
                this.social.shareViaEmail(this.publicacion.mensaje,
                  values.subject,
                  values.destino,[],[],this.publicacion.imagen
                  );
              }
              else {
                this.social.shareViaEmail(this.publicacion.mensaje,
                  values.subject,
                  values.destino);
              }
  
            }
          }
        ]
      });
      alert.present();
    }
    else {
      this.show_alert('Función disponible','en mobile');
    }
  }

  async show_alert(title:string,mensaje:string){
    let alert = await this.alert.create({
      header:title,
      subHeader:mensaje,
      mode:'ios',
      animated:true,
      buttons:['Aceptar']
    });
    alert.present();
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
        message:'De cambio de imagenes',
        animated:true,
        mode:'ios'
      });
      alert.present();
    }
  }
  async chekear_imagen(imagen){
    let pop = await this.pop.create({
      component:ImagenPublicacionComponent,
      animated:true,
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
