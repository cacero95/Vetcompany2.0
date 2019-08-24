import { Component, OnInit } from '@angular/core';

import { User } from 'src/app/models/grupos_animalistas';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

import { PetData } from 'src/app/models/pet_data/pet_data';
import { ModalController } from '@ionic/angular';

import { DbaService } from '../../services/dba.service';
import { SocialService } from '../../services/social.service';

@Component({
  selector: 'app-enterate',
  templateUrl: './enterate.page.html',
  styleUrls: ['./enterate.page.scss'],
})
export class EnteratePage implements OnInit {
  grupos:User[] = [];
  opcion = 'grupos';
  policial:PetData[] = [];
  tips:PetData[] = [];
  constructor(private social:SocialService,
    private iab:InAppBrowser,
    private dba:DbaService,
    private modal:ModalController) { }

  ngOnInit() {
    this.grupos_animalistas();
    this.datos_mascotas();
  }
  grupos_animalistas(){
    this.social.grupos_animalistas()
    .subscribe((teams:any)=>{
      this.grupos = teams.cuerpo.users;
      
    })
  }
  change_option(option){
    this.opcion = option;
    
    
  }
  visitar(url){
    this.iab.create(`${url[0].expanded_url}/`,"_blank");
  }
  datos_mascotas(){
    this.dba.buscar_info('info_mascotas').subscribe((data:any)=>{
      this.policial = data[0];
      this.tips = data[1];
      console.log(this.policial);
      console.log(this.tips);
    })
  }
  async ver_completo(consejo){
    
  }
  async ver_tweets(name,imagen,nombre){
    
  }
}
