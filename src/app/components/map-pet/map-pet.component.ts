import { Component, OnInit } from '@angular/core';
import { NavParams, PopoverController } from '@ionic/angular';
import { Mascotas } from '../../models/usuarios/user_pets';
@Component({
  selector: 'app-map-pet',
  templateUrl: './map-pet.component.html',
  styleUrls: ['./map-pet.component.scss'],
})
export class MapPetComponent implements OnInit {
  pets:Mascotas[] = [];
  constructor(private params:NavParams,
    private pop:PopoverController) { }

  ngOnInit() {
    this.pets = this.params.get('mascotas');
  }
  seleccionar(pet){
    this.pop.dismiss({
      pet
    })
  }
  close(){
    this.pop.dismiss();
  }
}
