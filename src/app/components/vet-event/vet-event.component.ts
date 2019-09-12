import { Component, OnInit } from '@angular/core';
import { PopoverController, AlertController } from '@ionic/angular';
import { Eventos } from '../../models/usuarios/user_pets';

@Component({
  selector: 'app-vet-event',
  templateUrl: './vet-event.component.html',
  styleUrls: ['./vet-event.component.scss'],
})
export class VetEventComponent implements OnInit {

  constructor(private pop:PopoverController,
    private alert:AlertController) { }

  ngOnInit() {}
  close(){
    this.pop.dismiss();
  }
  async show_mensaje(titulo,mensaje) {
    let alert = await this.alert.create({
      header:titulo,
      subHeader:mensaje
    });

    alert.present();
  }
  verificar_event(title:string,description:string,inicio:Date,termina:Date){
    let tick = true;
    let nuevo:Eventos = {
      title,
      description,
      startTime:inicio,
      endTime:termina
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
crear_event(nuevo){
  this.pop.dismiss({
    nuevo
  });
}

}