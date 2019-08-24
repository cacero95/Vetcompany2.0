import { Component, OnInit } from '@angular/core';
import { Veterinarias,User_pets } from 'src/app/models/usuarios/user_pets';
import { Events, AlertController, ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { DbaService } from '../../../services/dba.service';
import { UpdateUserComponent } from '../../../components/update-user/update-user.component';

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
})
export class AccountPage implements OnInit {
  user:User_pets;
  vet:Veterinarias;
  constructor(private dba:DbaService,
    private eventos:Events,
    private router:Router,
    private alert:AlertController,
    private modal:ModalController) { }

  ngOnInit() {
    let usuario = this.dba.getUsuario();
    if(usuario.type == 'institute'){
      this.vet = usuario;
    }
    else {
      this.user = usuario;
    }
    this.eventos.subscribe("login",(user)=>{
      this.vet = user;
      this.user = user;
    })
  }
  back(){
    this.router.navigate(['/home']);
  }
  async update_profile(user){
    let modal = await this.modal.create({
      component:UpdateUserComponent,
      componentProps:{
        usuario:user
      }
    });
    modal.present();
    const { data } = await modal.onDidDismiss();
    if (!data.salida){
      
    } 
    
    
  }
  close_session(){
    this.dba.setUsuario(null);
    this.router.navigate(['']);
  }

}
