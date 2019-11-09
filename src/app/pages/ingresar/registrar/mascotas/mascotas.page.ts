import { Component, OnInit } from '@angular/core';
import { DbaService } from '../../../../services/dba.service';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-mascotas',
  templateUrl: './mascotas.page.html',
  styleUrls: ['./mascotas.page.scss'],
})
export class MascotasPage implements OnInit {

  constructor(private dba:DbaService,
    private modal:ModalController) { }

  ngOnInit() {
  }

  select_image(){
    this.dba.select_img().then((data)=>{
      console.log(data);
    })
  }
  close(){
    this.modal.dismiss();
  }

}
