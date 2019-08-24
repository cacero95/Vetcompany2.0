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
  chat_grupo:Chats;
  url:string;
  chat:Chats;
  titulo:string;
  nombre_chat = '';
  type:string;
  user:Users;
  mensaje:Mensaje;
  usuario:Users;
  integrantes:Users[] = [];
  conversacion:Mensaje[] = [];
  publicar_integrantes:any[] = []; 
  constructor(private storage:Storage,
    private dba:DbaService,
    private params:NavParams,
    private modal:ModalController) { }

  ngOnInit() {
    this.chat = this.params.get('chat');
    this.user = this.params.get('user');
    this.chat_grupo = this.params.get('grupo');
    if(this.chat){
      this.integrantes = this.params.get('usuarios_entrantes');
      if(!this.chat_grupo){
        // quiere decir conversacion 1-1
        this.asignar_datosChat(this.chat);
      }
      else {
        this.asignar_datosChat(this.chat_grupo);
      }
      this.crear_chat();
    }
    else {
      this.nombre_chat = this.params.get('nombre');
      this.integrantes = this.params.get('usuarios_entrantes');
      
      if (this.chat_grupo){
        this.asignar_datosChat(this.chat_grupo);
      }
      else {
        this.asignar_datosChat();
      }
      this.crear_chat();
    }
    
  }
  asignar_datosChat(chat?:Chats){
    // si se agrega el chat a la entrada significa que el chat es de un grupo
    if(chat){     
      this.nombre_chat = chat.nombre;
      this.conversacion = chat.mensaje;
      this.url = 'assets/img/chat_user.PNG';
      if (this.integrantes.length == 2){
        let usuario = this.integrantes.find((us)=>{
          return this.user.email !== us.email
        });
        if (usuario.url){
          this.url = usuario.url;
        }
        this.titulo = usuario.name;
        if (usuario.apellido){
          this.titulo = `${usuario.name} ${usuario.apellido}`;
        }
      }
      else {
        this.titulo = chat.nombre;
        if(chat.url){
          this.url = chat.url;
        }
      }
    }
    // si entra al else quiere decir el chat es entre dos personas
    else {
      let find = this.integrantes.find((us)=>{
        return us.email !== this.user.email
      });
      this.titulo = find.name;
      if (find.apellido){
        this.titulo = `${find.name} ${find.apellido}`;
      }
      this.url = 'assets/img/chat_user.PNG';
      if (find.url) {
        this.url = find.url;
      }
    }
  }
  back(){
    this.modal.dismiss();
  }
  
  crear_chat(){
    // quitamos los datos innecesarios en cada uno de los integrantes del chat
    for (let integrante of this.integrantes){
      let nuevo_integrante = new Object();
      if (!integrante.chats){
        integrante.chats = [];
      }
      for (let feature in integrante){
        if (feature != "chats" && feature != "veterinarias" && feature != "users" && feature != "calificaciones" && feature != "tasks"){
          nuevo_integrante[feature] = integrante[feature];
        }
      }
      this.publicar_integrantes.push(nuevo_integrante)
    }
    let creador:Users = {
      name:this.user.name,
      email:this.user.email,
      type:this.user.type
    }
    if (this.user.apellido){
      creador.apellido = this.user.apellido;
    }
    if(this.chat_grupo){
      this.mensaje = {
        creador,
        contenido:'',
        url:'assets/img/chat_user.PNG'
      }
      if (this.user.url){
       this.mensaje.url = this.user.url; 
      }
    }
    else {
      this.mensaje = {
        creador,
        contenido:'',
        url:'assets/img/chat_user.PNG'
      }
      if (this.user.url){
        this.mensaje.url = this.user.url;
      }
      this.chat = {
        nombre:this.nombre_chat,
        type:'individual',
        users:this.publicar_integrantes  
      }
    }
  }
  async publicar(mensaje){
    
    this.mensaje.contenido = mensaje;
    
    let send = document.getElementById('message');
    
    
    this.conversacion.unshift(this.mensaje);
    for (let integrante of this.integrantes){
      
      let find = integrante.chats.findIndex((element)=>{
        return element.nombre === this.nombre_chat
      });
      if (find > -1) {
        integrante.chats[find].mensaje.push(this.mensaje);
      }
      else {
        // se pregunta si el integrante no tiene chats
        // con el fin de poder inicializar sus chats
        // esto quiere decir que es un chat nuevo
        this.chat["mensaje"] = this.conversacion;
        // agrego el nuevo chat al arreglo de chats de cada usuario
        integrante.chats.push(this.chat);
      }
      //usuarios/
      await this.dba.publicar_info(integrante,integrante.email,'usuarios');
    }
    
  }
}
