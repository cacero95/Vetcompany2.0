import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User_pets, Veterinarias } from 'src/app/models/usuarios/user_pets';
import { Events, AlertController, Platform } from '@ionic/angular';
import { Users } from '../models/usuarios/user_pets';
import { HttpClient } from '@angular/common/http';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { File,FileEntry } from '@ionic-native/file/ngx';
import { Storage } from '@ionic/storage';

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
    private alert:AlertController,
    private http:HttpClient,
    private camera:Camera,
    private file:File,
    private web:WebView,
    private file_path:FilePath,
    private platform:Platform,
    private storage:Storage) { }

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
      if (this.platform.is('cordova')){
        let token = this.storage.get('token');
        usuario.token = token;
        this.fireDba.object(`usuarios/${this.key}`).update(usuario).then()
        .catch((err)=>{
          console.log(err);
        })
        
      }
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

  getToken(correo:string):Promise<any>{
    correo = correo.replace("@","_");
    while(correo.indexOf(".") != -1 ){
      correo.replace(".","_");
    }
    return new Promise((resolve,reject)=>{
          
      return this.fireDba.list(`usuarios/${correo}`).snapshotChanges()
        .pipe(map(element=>{
          return element.map((values)=>{
          let data = values.payload.val();
          return data; 
      })
    })).subscribe((data)=>{
      
    })
    })
  }

  select_img():Promise<any>{
    return new Promise((resolve,reject)=>{
      let options: CameraOptions = {
        quality: 100,
        sourceType:this.camera.PictureSourceType.PHOTOLIBRARY,
        saveToPhotoAlbum: false,
        correctOrientation: true
      };
      let archivo;
      if (this.platform.is('cordova')){
        this.camera.getPicture(options).then((imagePath)=>{
          if (this.platform.is('android')){
            this.file_path.resolveNativePath(imagePath).then((filePath)=>{
              archivo["correctPath"] = filePath.substr(0, filePath.lastIndexOf('/') + 1);
              archivo["currentName"] = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
              //this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
            })
          }
          else {
            archivo["currentName"] = imagePath.substr(imagePath.lastIndexOf('/') + 1);
            archivo["correctPath"] = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
            //this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
          }
          resolve(archivo)
        }).catch((err)=>{
          console.log(err);
          reject(false);
        })
      }
    })
  }

  createFileName() {
    var d = new Date(),
        n = d.getTime(),
        newFileName = n + ".jpg";
    return newFileName;
}
 
copyFileToLocalDir(namePath, currentName, newFileName) {
  console.log(namePath);
  console.log(currentName);
  console.log(newFileName);
  this.file.copyFile(namePath, currentName, this.file.dataDirectory, newFileName);
}

  cargar_usuario (integrante){
    let usuario = new Object();
    return this.fireDba.list(`usuarios/${integrante}`).snapshotChanges()
      .pipe(map(values=>{
        return values.map((value)=>{
          let us = new Object()
          let key = value.key
          us[key] = value.payload.val()
          usuario[key] = value.payload.val()
          return {us,usuario};
        })
      }));
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
    this.fireDba.object(`${path}/${this.key}/`).update(usuario);
  }
  // publica contenido sin fijarse en los usuarios
  push_contenido(contenido, path:string){
    this.fireDba.object(`${path}`).update(contenido);
  }
  sendNotification(title,mensaje, origen){
    let cuerpo = {
      destino:this.token,
      title,
      mensaje,
      origen
    }
   return new Promise ((resolve,reject)=>{
     this.http.post(`https://gag-6f2a5.firebaseapp.com/notificaciones`,cuerpo).subscribe((data)=>{
       resolve(true);
     },err=>{
       reject(false);
     })
   })  
  }
  update_user(us:Users){
    this.key = us.email;
    this.key = this.key.replace("@","_");
    while(this.key.indexOf(".")!=-1){
      this.key = this.key.replace(".","_");
    }
    return new Promise((resolve,reject)=>{
      this.fireDba.object(`usuarios/${this.key}`).update(us)
      .then(()=>{
        resolve(true);
      }).catch(()=>{
        reject(false);
      })
    });
  }
  /**
   * 
   * Publica contenido en el
   * storage de firebase
   */
  
  publicar_imagen(imagen:string):any{
    return new Promise((resolve,reject)=>{
      let firestorage = firebase.storage().ref();
      let file_name = new Date().valueOf().toString();
      let fire_task:firebase.storage.UploadTask = firestorage.child(`/img/${file_name}`)
      .putString(imagen,'base64 ',{contentType:'image/jpeg'});
      fire_task.on(firebase.storage.TaskEvent.STATE_CHANGED,
        ()=>{
          // en medio de la subida de la imagen
        },
        ()=>{
          reject(false); // error en la subida de la imagen
        },
        ()=>{
          // Exito en la subida de la imagen
          firestorage.child(`img/${file_name}`).getDownloadURL().then((direccion:string)=>{
            resolve(direccion);
          });    
        }
        )
    })
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
  /**
   * Queria obtimizar este metodo con el publicar_info pero
   * como tiene que guardar en dos partes diferentes el usuario
   * so sad :(
   */
  update_veterinarias(vet:Veterinarias){
    this.key = vet.email;
    this.key = this.key.replace("@","_");
    while(this.key.indexOf(".")!=-1){
      this.key = this.key.replace(".","_");
    }
    this.fireDba.object(`veterinarias/${this.key}`).update(vet).then(()=>{
      this.fireDba.object(`usuarios/${this.key}`).update(vet)
    });
  }
  
}
