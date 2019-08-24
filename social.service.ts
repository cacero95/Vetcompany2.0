import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as firebase from 'firebase';
import { AngularFireDatabase } from '@angular/fire/database';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class SocialService {

  constructor(private http:HttpClient,
    private firedba:AngularFireDatabase) { }

  get_publicaciones(){
    
    return this.firedba.list(`publicaciones`).snapshotChanges()
    .pipe(map(values=>{
      return values.map(value=>{
        let data = value.payload.val();
        return data;
      })
    }))
  }

  buscar_tema(tema){
    let cuerpo =  {
      type: 'hashtag',
      tema
    }
    this.http.post(`https://companyserver.herokuapp.com/`,cuerpo)
    .subscribe((resultado)=>{
      console.log(resultado);
    })
  }
  publicar_noticia(cuerpo){
    this.http.post(`https://vetcompany.herokuapp.com/twitter_post`,cuerpo);
  }
  grupos_animalistas(){
    let cuerpo = {
      type:'normal'
    }
    return this.http.post(`https://vetcompany.herokuapp.com/twitter`,cuerpo)
  }
  getTweets(name:string){
    let cuerpo = {
      type:'tweets',
      tema:name
    }
    return this.http.post(`https://vetcompany.herokuapp.com/twitter`,cuerpo);
  }
}


