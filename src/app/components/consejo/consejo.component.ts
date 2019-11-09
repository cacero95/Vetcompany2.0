import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { PetData } from '../../models/pet_data/pet_data';

@Component({
  selector: 'app-consejo',
  templateUrl: './consejo.component.html',
  styleUrls: ['./consejo.component.scss'],
})
export class ConsejoComponent implements OnInit {
  pet_data:PetData;
  type:string;
  constructor(private modal:ModalController,
    private params:NavParams) { }

  ngOnInit() {
    this.pet_data = this.params.get('consejo');
    this.type = this.params.get('type');
  }

  close(){
    this.modal.dismiss();
  }

}
