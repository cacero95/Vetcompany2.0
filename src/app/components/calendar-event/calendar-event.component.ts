import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ModalController, AlertController, NavParams, Platform } from '@ionic/angular';
import { Eventos, Users, Meeting } from '../../models/usuarios/user_pets';

@Component({
  selector: 'app-calendar-event',
  templateUrl: './calendar-event.component.html',
  styleUrls: ['./calendar-event.component.scss'],
})
export class CalendarEventComponent implements OnInit {

  
  tick:boolean;
  usuario:Users;
  check:boolean = false;
  stayholders:Meeting[] = [];
  constructor(private modal:ModalController,
    private alert:AlertController,
    private params:NavParams,
    private platform:Platform) { }

  ngOnInit() {
    this.platform.ready().then(()=>{
      this.usuario = this.params.get('usuario');
      console.log(this.usuario);
    })
  }
  back(){
    this.modal.dismiss();
  }
  verificar_event(title:string,description:string,inicio:Date,termina:Date){
    let tick = true;
    let nuevo:Eventos = {
      title,
      description,
      startTime:inicio,
      endTime:termina
    }
    if (this.stayholders.length > 0){
      nuevo.to = this.stayholders;
    }
    for(let element in nuevo){
      if (!nuevo[element]){
        // si hay algun elemento esta vacio tick se vuelve falso
        // para indicar que es necesario mandar un mensaje
        tick = false;
        let titulo
        switch(element){
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
        this.show_mensaje(titulo,'no puede estar vacio');
      }
    }
    
    if (tick){
      this.crear_event(nuevo);
    }
  }
  crear_event(nuevo:Eventos){
    this.modal.dismiss(
      {
        "evento":nuevo
      }
    ) 
  }
  agregar_meetings(email:string, name:string, imagen:string, item){
    let meeting:Meeting; 
    if (imagen){
      meeting = {
        email,
        name,
        imagen
      }
    }
    else {
      meeting = {
        email,
        name
      }
    }
    let find = this.stayholders.find((elements)=>{
      return elements.email === meeting.email
    });
    if (!find){
     this.stayholders.push(meeting); 
    }
    console.log(this.stayholders)
  }
  async show_mensaje(titulo:string,mensaje:string){
    let alert = await this.alert.create({
      header:titulo,
      subHeader:mensaje,
      buttons:['Confirmar']
    });
    alert.present();
  }
}
