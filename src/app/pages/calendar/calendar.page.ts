import { Component, OnInit, ViewChild, Inject, LOCALE_ID } from '@angular/core';
import { Router } from '@angular/router';
import { CalendarComponent } from 'ionic2-calendar/calendar';
import { ModalController } from '@ionic/angular';
import { Users, Eventos } from '../../models/usuarios/user_pets';
import { DbaService } from '../../services/dba.service';
import { CalendarEventComponent } from '../../components/calendar-event/calendar-event.component';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.page.html',
  styleUrls: ['./calendar.page.scss'],
})
export class CalendarPage implements OnInit {

  calendar = {
    mode: 'month',
    currentDate: new Date(),
    locale: 'es'
  };
  event = {
    title: '',
    description: '',
    startTime: '',
    endTime: ''
  };
  usuario:Users;
  origen_eventos:any[] = [];
  @ViewChild(CalendarComponent,{static:true}) myCal: CalendarComponent;
  constructor(private router:Router,
    private dba:DbaService,
    private modal:ModalController,
    @Inject(LOCALE_ID) private locale: string) { }


  ngOnInit() {
    this.usuario = this.dba.getUsuario();
    if (this.usuario){
      if(this.usuario.tasks){
        for(let tarea of this.usuario.tasks){
          this.update_tasks(tarea);
        }
      }
    }
  }
  update_tasks(task:Eventos){
    let eventCopy:Eventos = {
      title: task.title,
      startTime:  new Date(task.startTime),
      endTime: new Date(task.endTime),
      description: task.description
    }

    this.origen_eventos.push(eventCopy);
    this.myCal.loadEvents(); 
    this.resetEvent();
  }
  resetEvent() {
    this.event = {
      title: '',
      description: '',
      startTime: new Date().toISOString(),
      endTime: new Date().toISOString(),
   };
  }
  async add_event(){
    let modal = await this.modal.create({
      component:CalendarEventComponent,
      componentProps:{
        usuario:this.usuario
      }
    })
    modal.present();
    const {data} = await modal.onDidDismiss();
    if (data){
      let evento:Eventos = data.evento;
      console.log(evento);
      let copia_evento:Eventos = {
        title: evento.title,
        description: evento.description,
        startTime: new Date(evento.startTime),
        endTime: new Date(evento.endTime)
      }
      this.origen_eventos.push(copia_evento);
      this.myCal.loadEvents();
      this.resetEvent();
    }
  }
  navegar(url){
    this.router.navigate([`${url}`]);
  }
  async onEventSelected(evento){

  }
  onViewTitleChanged(titulo){

  }
  onTimeSelected(time){

  }
}
