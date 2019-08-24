import { Component, OnInit } from '@angular/core';
import { PopoverController, AlertController, NavParams } from '@ionic/angular';
import { Eventos, Veterinarias, Destino } from '../../models/usuarios/user_pets';
@Component({
  selector: 'app-pop-mascota',
  templateUrl: './pop-mascota.component.html',
  styleUrls: ['./pop-mascota.component.scss'],
})
export class PopMascotaComponent implements OnInit {
  veterinaria:Veterinarias;
  destino = {} as Destino;
  constructor(private pop:PopoverController,
    private alert:AlertController,
    private params:NavParams) { }


    ngOnInit() {
      this.veterinaria = this.params.get('veterinaria');
      if (this.veterinaria.url){
        this.destino = {
          name:this.veterinaria.name,
          url:this.veterinaria.url,
          email:this.veterinaria.email
        }
      }
      else {
        this.destino = {
          name:this.veterinaria.name,
          email:this.veterinaria.email
        }
      }
    }
  
    async confirmar(title,description,startTime,endTime){
      let event:Eventos ={
        title,
        description,
        startTime,
        endTime,
        destino:this.destino
      }
      let tick = true;
      for (let key in event){
        if(!event[key]){
          tick = false;
          let titulo
          switch(key){
            case 'title':
              titulo = 'título'
              break;
            case 'description':
              titulo = 'descripción'
              break;
            case 'startTime':
              titulo = 'inició'
              break;
            case 'endTime':
              titulo = 'termina'
              break;
          }
          this.show_message(titulo,'No puede estar vacio');
        }
      }
      if (tick){
        this.pop.dismiss({
          'evento':event
        })
      }
    }
    async show_message(titulo,mensaje){
      let alert = await this.alert.create({
        header:titulo,
        subHeader:mensaje,
        buttons:['Confirmar']
      });
      alert.present();
    }
  }
  
