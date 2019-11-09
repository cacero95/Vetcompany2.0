import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController, AlertController } from '@ionic/angular';
import { SocialService } from '../../services/social.service';
import { Status } from '../../models/social/twitter_model';

@Component({
  selector: 'app-grupos',
  templateUrl: './grupos.component.html',
  styleUrls: ['./grupos.component.scss'],
})
export class GruposComponent implements OnInit {

  busqueda;
  tuits:Status[] = [];
  constructor(private params:NavParams,
    private social:SocialService,
    private modal:ModalController,
    private alert:AlertController) { }

  ngOnInit() {
    this.busqueda = this.params.get('grupo');
    this.cargar_tweets();
  }
  cargar_tweets(){
    this.social.getTweets(this.busqueda.name)
    .subscribe((data:any)=>{
      this.tuits = data.cuerpo.statuses;
    })
  }
  async show_alert(creado:string){
    let alert = await this.alert.create({
      header:'Creado el',
      subHeader:creado,
      mode:'ios',
      animated:true,
      translucent:true
    });
    alert.present();
  }
  close (){
    this.modal.dismiss();
  }
}
