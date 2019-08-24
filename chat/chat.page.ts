import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Chats, Users, Mensaje } from '../../models/usuarios/user_pets';
import { DbaService } from '../../services/dba.service';
import { NavParams, ModalController } from '@ionic/angular';
@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {
  url:string;
  mensaje = {} as Mensaje;
  chat:Chats;
  titulo:string;
  nombre_chat = '';
  type:string;
  usuario:Users;
  user:Users;
  integrantes:Users[] = [];
  conversacion:Mensaje[] = [];
  publicar_integrantes:Users[] = [];
  constructor(private storage:Storage,
    private dba:DbaService,
    private params:NavParams,
    private modal:ModalController) { }

  ngOnInit() {
    this.chat = this.params.get('chat');
    this.user = this.params.get('user');
    if(this.chat){
      
      this.nombre_chat = this.chat.nombre;
      this.integrantes = this.chat.users;
      this.conversacion = this.chat.mensaje;
      
      this.load_integrantes();
      if(this.integrantes.length == 2){
        // quiere decir conversacion 1-1
        this.asignar_chat();
               
      }
      else {
        this.titulo = this.chat.nombre;
      }
    }
    else {
      this.chat = {} as Chats;
      this.nombre_chat = this.params.get('nombre');
      this.integrantes = this.params.get('usuarios_entrantes');
      this.update_chat();
      this.crear_chat();
    }
    
  }
  asignar_chat(){
    
    let index = this.integrantes.findIndex((us)=>{
      return  us.email !== this.user.email;
    });
    let integrante:Users = this.integrantes[index];
    this.titulo = integrante.name;
    this.url = 'assets/img/chat_user.PNG';
    if(integrante.url){
      this.url = integrante.url;
    }
    if (this.integrantes[index].apellido){
      this.titulo = `${integrante.name} ${integrante.apellido}`;
    }
    // se quita la informacion que no se necesita
    // y se agrega al template del mensaje que se va crear
    let us:any = {};
    us['name'] = this.user.name;
    us['email'] = this.user.email;
    this.mensaje['creador'] = us;
    // se pregunta si el usuario tiene foto de chat
    this.mensaje['url'] = 'assets/img/chat_user.PNG';
    if (integrante.url){
      this.mensaje['url'] = integrante.url;
    }

  } 
  back(){
    this.modal.dismiss();
  }
  async load_integrantes(){
    let personas:Users[] = [];
    personas.push(this.user);
    for (let x = 1; x < this.integrantes.length; x++){
      let llave = this.integrantes[x].email;
      llave = llave.replace("@","_");
      while(llave.indexOf(".")!=-1){
        llave = llave.replace(".","_");
      }
      let persona:any = await this.dba.load_integrante(llave);
      if (persona.email){
        personas.push(persona);
      }
      
    }
    this.integrantes = personas;
  }
  update_chat(){
    if(this.integrantes.length > 2){
      // si hay mas de dos integrantes significa que es un grupo
      this.titulo = this.nombre_chat;
    }    
    else {
      this.chat['type'] = 'individual';
      let index = this.integrantes.findIndex((integrant)=>{
        return integrant.email !== this.user.email
      });
      let integrante = this.integrantes[index];
      this.titulo = integrante.name;
      if(integrante.apellido){
        this.titulo = `${integrante.name} ${integrante.apellido}`;
      }
      this.url = 'assets/img/chat_user.PNG';
      if(integrante.url){
        this.url = integrante.url;
      }
      
      //assets/img/chat_user.PNG
    }
    
  }
  crear_chat(){
    let usuarios = [];
    for (let integrante of this.integrantes){
      let us = new Object();
      for(let feature in integrante){
        console.log(feature)
        if(feature != "chats" && feature != "veterinarias" && feature != "users" && feature != "calificaciones" && feature != "tasks" ){
          us[feature] = 'hola'
        }
      }
      console.log(us);
      usuarios.push(us);
      us = {};
    }
    
    this.chat['users'] = usuarios;
    this.chat['nombre'] = this.nombre_chat;
    this.chat['mensaje'] = [];
    this.mensaje['url'] = 'assets/img/chat_user.PNG';
    let usuario = {};
    if(this.user.url){
      this.mensaje['url'] = this.user.url;
    }
    usuario['name'] = this.user.name;
    usuario['email'] = this.user.email;
    if(this.user.apellido){
      usuario['apellido'] = this.user.apellido;
    }
    this.mensaje['creador'] = this.usuario;
  }
  async publicar(mensaje){
    
    this.mensaje['contenido'] = mensaje
    this.conversacion.unshift(this.mensaje);
    
    let send = document.getElementById('message');
    send.innerHTML = "";
    for (let integrante of this.integrantes){
      let find = integrante.chats.findIndex((element)=>{
        return element.nombre === this.nombre_chat
      });
      if (find > -1){
        integrante.chats[find].mensaje = this.conversacion;
      }
      else {
        // esto quiere decir que es un chat nuevo
        this.chat["mensaje"] = this.conversacion;
        // agrego el nuevo chat al arreglo de chats de cada usuario
        integrante.chats.push(this.chat);
      }
      await this.dba.publicar_info(integrante,integrante.email,'usuarios');
    }
    
  }
}
