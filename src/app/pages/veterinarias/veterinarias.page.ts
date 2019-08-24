import { Component, OnInit } from '@angular/core';
import { AlertController, Platform, PopoverController } from '@ionic/angular';
import { Router } from '@angular/router';
import { DbaService } from '../../services/dba.service';
import { Veterinarias, Users, Calificaciones } from '../../models/usuarios/user_pets';
import { PopMascotaComponent } from '../../components/pop-mascota/pop-mascota.component';

@Component({
  selector: 'app-veterinarias',
  templateUrl: './veterinarias.page.html',
  styleUrls: ['./veterinarias.page.scss'],
})
export class VeterinariasPage implements OnInit {

  veterinarias:Veterinarias[] = [];
  vet_usuario:boolean;
  usuario:Users;
  change_options:boolean;

  constructor(private dba:DbaService,
    private router:Router,
    private alert:AlertController,
    private platform:Platform,
    private pop:PopoverController) { }

  ngOnInit() {
    this.platform.ready().then(()=>{
      this.vet_usuario = false;
      this.dba.buscar_info('veterinarias').subscribe((vets:any)=>{
        this.veterinarias = vets;
        this.valoracion();
        this.usuario = this.dba.getUsuario();
        if (this.usuario.veterinarias){
          console.log(this.usuario.veterinarias);
            this.vet_usuario = true;
            this.change_options = true;
            this.filtrar_enUso();
        }
        else {
          this.change_options = false;
        }
      });
    });
  }
  filtrar_enUso(){
    for (let veterinaria of this.usuario.veterinarias){
      this.veterinarias = this.veterinarias.filter((element)=>{
        return veterinaria.email !== element.email;
      })
    }
  }
  valoracion(){
    for(let veterinaria of this.veterinarias){
      if (veterinaria.calificaciones){
        let contador_notas = 0;
        for(let quiz of veterinaria.calificaciones){
          contador_notas = contador_notas + quiz.estrellas;
        }
        contador_notas = contador_notas / veterinaria.calificaciones.length;
        veterinaria.valoracion = contador_notas;
        this.dba.update_veterinarias(veterinaria);
      }
    }
  }
  async show_info(veterinaria:Veterinarias){
    let alert = await this.alert.create({
      header:veterinaria.name,
      subHeader:veterinaria.direccion,
      message:`Correo:${veterinaria.email} <br><br> Número ${veterinaria.telefono}`,
      mode:'ios',
      buttons:['Confirmar']
    });
    alert.present();
  }
  async calificar_veterinaria(veterinaria:Veterinarias){
    let pop = await this.pop.create({
      component:PopMascotaComponent,
      mode:'ios',
      componentProps:{
        veterinaria
      }
    });
    pop.present();
    let {data} = await pop.onDidDismiss();
    if (data){
      if(!this.usuario.tasks){
        this.usuario.tasks = [];
      }
      this.usuario.tasks.push(data.evento);
      let respuesta = this.dba.update_user(this.usuario);
      if(respuesta){
        this.show_mensaje('Creación','Con exito');
      }
    }
  }
  navegar(url){
    this.router.navigate([`/${url}`]);
  }
  buscar(veterinaria){
    console.log(veterinaria.target.value);
  }
  registrarse(veterinaria:Veterinarias){
    if (!this.usuario.veterinarias){
      this.usuario.veterinarias = [];
    }
    this.usuario.veterinarias.push(veterinaria);
    let find = this.veterinarias.findIndex((vet)=>{
      return vet.email === veterinaria.email
    })
    this.veterinarias.splice(find,1);
    let update = this.dba.update_user(this.usuario);
    if(update){
      this.show_mensaje('Creación','Con exito');
    }
  }
  async show_mensaje(title:string,mensaje:string){
    let alert = await this.alert.create({
      header:title,
      mode:'ios',
      subHeader:mensaje,
      buttons:['Confirmar']
    });
    alert.present();
  }
  async onRateChange(event,veterinaria:Veterinarias){
    let calificacion:Calificaciones;
    let comentario:string;
    console.log(event);
    let alert = await this.alert.create({
      header:`${event} estrellas`,
      subHeader:'Agrega una opinión',
      inputs:[
        {
          name:'argumento',
          type:'text',
          placeholder:'Comenta...'
        }
      ],
      buttons:[
        {
          text:'Cancelar'
        },
        {
          text:'Confirmar',
          handler:(commet)=>{
            comentario = commet.argumento 
          }
        }
        
      ]
    });
    alert.present();
    calificacion = {
      name:this.usuario.name,
      usuario:this.usuario.email,
      comentario:comentario,
      estrellas:event
    }
    if (calificacion.comentario){
      if (!veterinaria.calificaciones){
        veterinaria.calificaciones = [];
      }
      veterinaria.calificaciones.push(calificacion);
      this.dba.update_veterinarias(veterinaria);
    }
  }
}
