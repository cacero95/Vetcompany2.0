import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User_pets, Veterinarias } from 'src/app/models/usuarios/user_pets';
import { Events, AlertController } from '@ionic/angular';
import { Users } from '../models/usuarios/user_pets';

@Injectable({
  providedIn: 'root'
})
export class DbaService {

  key:string;
  actualiza:Observable<any[]>;
  token:string;
  usuario;

  constructor(private fireDba:AngularFireDatabase,
    private events:Events,
    private auth:AngularFireAuth,
    private alert:AlertController) { }

  login(email:string){
    let us = new Object();
    this.key = email;
    this.key = this.key.replace("@","_");
        while(this.key.indexOf(".") != -1){
          this.key = this.key.replace(".","_");
        }
    return new Promise((resolve,reject)=>{
      this.fireDba.list(`usuarios/${this.key}/`).snapshotChanges()
      .pipe(map(element=>{
        return element.map((value)=>{
          let key = value.key;
          
          us[key] = value.payload.val();
          return us;
        })
      })).subscribe(()=>{
        
        this.setUsuario(us);
        resolve(true);
      },(err)=>{
        reject(false);
      })
    })
  }
  setUsuario(usuario){
    if(usuario){
      this.events.publish("login",usuario);
      this.usuario = usuario;
    }
    else{
      this.events.publish("close_sesion",null);
      this.usuario = null;
      this.sign_out();
    }
  }
  getUsuario(){
    return this.usuario;
  }
  load_integrante(integrante:string){
    let usuario = new Object();
    return new Promise((resolve,reject)=>{
      this.fireDba.list(`usuarios/${integrante}`).snapshotChanges()
      .pipe(map(values=>{
        return values.map((value)=>{
          let us = new Object()
          let key = value.key
          us[key] = value.payload.val()
          usuario[key] = value.payload.val()
          return us;
        })
      })).subscribe((data)=>{
        resolve(usuario)
      })
    })
  }
  /**
   * Path funciona para buscar la ruta en la base de datos
   */
  publicar_info(usuario:Users, key:string, path){
    this.key = key;
    this.key = this.key.replace("@","_");
    while(this.key.indexOf(".") != -1){
      this.key = this.key.replace(".","_");
    }
    console.log(usuario);
    
    this.fireDba.object(`${path}/${this.key}/`).update(usuario);
  }
  registrar_pets(usuario:User_pets,is_imagen:boolean){

    this.key = usuario.email
        this.key = this.key.replace("@","_");
        while(this.key.indexOf(".") != -1){
          this.key = this.key.replace(".","_");
        }
    return new Promise ((resolve,reject)=>{
      
      if(is_imagen){
        
        for (let contador = 0; contador < usuario.mascotas.length; contador++){
          if (usuario.mascotas[contador].url){
            let firestorage = firebase.storage().ref(); // aqui queda refernciada el storage de firebase
            let file_name = new Date().valueOf().toString();
            let fire_task:firebase.storage.UploadTask = firestorage.child(`/img/${file_name}`)
            .putString(usuario.mascotas[contador].url,'base64',{contentType: 'image/jpeg'});
            fire_task.on(firebase.storage.TaskEvent.STATE_CHANGED,
            ()=>{
              // en medio de la subida de la imagen
            },
            ()=>{
              reject(false);
            },
            ()=>{
              firestorage.child(`img/${file_name}`).getDownloadURL().then(direccion=>{
                usuario.mascotas[contador] = direccion;
              });
              
            }  
            )       

          }
        }
        
        this.fireDba.object(`usuarios/${this.key}/`).update(usuario).then(()=>{
          this.setUsuario(usuario);
          resolve(true);
        }).catch(()=>{
          reject(false);
        })
      }
      else {
        this.fireDba.object(`usuarios/${this.key}/`).update(usuario).then(()=>{
          this.setUsuario(usuario);
          resolve(true);
        }).catch(()=>{
          reject(false);
        })
      }
    })

  }
  
  registrar_vet(vet:Veterinarias){
    return new Promise ((resolve,reject)=>{

      if (vet.url){
        let firestorage = firebase.storage().ref();
        let file_name = new Date().valueOf().toString();
        let fire_task: firebase.storage.UploadTask = firestorage.child(`/img/${file_name}`)
        .putString(vet.url,'base64',{contentType:'image/jpeg'});
        fire_task.on(firebase.storage.TaskEvent.STATE_CHANGED,()=>{
  
        },
        ()=>{
  
        },
        ()=>{
          firestorage.child(`/img/${file_name}`).getDownloadURL().then((url)=>{
            vet.url = url;
          }).then(()=>{
            this.fireDba.object(`${this.key}/`).update(vet).then(()=>{
              this.setUsuario(vet);
              resolve(true);
            }).catch(()=>{
              reject(false);
            })
          })
  
        })
      }
      else {
        this.fireDba.object(`${this.key}`).update(vet).then(()=>{
          this.setUsuario(vet);
          resolve(true);
        }).catch(()=>{
          reject(false);
        })
      }
    })
  }
  sign_out(){
    this.auth.auth.signOut().then(async()=>{
      let alert = await this.alert.create({
        header:'Exito!',
        subHeader:'Al cerrar sesión',
        buttons:['confirmar']
      })
      alert.present();
    })
  }
  buscar_info(search:string){
    return this.fireDba.list(`${search}`).snapshotChanges()
    .pipe(map(element=>{
      return element.map((values)=>{
        let data = values.payload.val();
        return data; 
      })
    }))
  }
}
