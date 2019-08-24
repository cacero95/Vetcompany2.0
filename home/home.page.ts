import { Component, OnInit } from '@angular/core';
import { Platform, Events, ModalController } from '@ionic/angular';
import { Users, Chats } from '../../models/usuarios/user_pets';
import { DbaService } from '../../services/dba.service';
import { Router } from '@angular/router';
import { ChatPage } from '../chat/chat.page';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  user:Users;
  usuarios:Users[] = [];
  is_chats:boolean;
  chats:boolean;
  constructor(private platform:Platform,
    private eventos:Events,
    private dba:DbaService,
    private router:Router,
    private modal:ModalController) { }

  ngOnInit() {
    if(this.platform.ready()){
      this.eventos.subscribe("login",(user)=>{
        // cuando se crea el evento de inicio de sesion
        // la variable user recivira toda la Información
        this.user = user;
        this.load_chats();
        
      });
    }
    if (!this.user){
      this.user = this.dba.getUsuario();
    }
  }
  load_chats(){
    this.dba.buscar_info('usuarios').subscribe((chats:any)=>{
      // si tiene chats busco el usuario para
      // eliminar el usuario de la lista de usuarios
      // disponibles      
      if (this.user.chats){
        this.is_chats = true;
        this.usuarios = chats.filter((us)=>{
          return us.email !== this.user.email
        });
        console.log(this.usuarios);
        /**
         * Comparo todos los usuarios que la persona 
         * que ingreso converso y los quito de los chats
         * disponibles
         */
        for(let chat of this.user.chats){
          for(let user of chat.users){
            this.usuarios = this.usuarios.filter((talk)=>{
              return talk.email !== user.email
            })
          }
        }
      }
      else {
        this.usuarios = chats;
      }
    })
    
  }
  navegar(url){
    this.router.navigate([`${url}`]);
  }
  async entrar_chat(chat:Chats){

    let modal = await this.modal.create({
      component:ChatPage,
      componentProps:{
        chat,
        user:this.user   
      }
    });
    modal.present();
    
  }
  async crear_chat(usuario_destino:Users){

    let nombre = `${this.user.email}-${usuario_destino.email}`;
    
    let usuarios_entrantes = [this.user,usuario_destino];
    let modal = await this.modal.create({
      component:ChatPage,
      componentProps:{
        nombre,
        usuarios_entrantes,
        user:this.user
      }
    });
    modal.present();
    modal.onDidDismiss().then(()=>{
      if (this.user.chats){
        this.chats = true;
      }
      
    })
  }
  change_option(valor){
    this.chats = valor;
  }
  async entrar_grupo(grupo:any[],nombre:string){
    let chats_entrantes = [];
    chats_entrantes = grupo;
    chats_entrantes.push(this.user); 
  }
  buscar_usuarios(event){
    console.log(event.target.value);
  }
}
