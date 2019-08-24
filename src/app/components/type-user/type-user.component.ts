import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-type-user',
  templateUrl: './type-user.component.html',
  styleUrls: ['./type-user.component.scss'],
})
export class TypeUserComponent implements OnInit {

  constructor(private modal:ModalController) { }

  ngOnInit() {
  }
  cerrar(){
    this.modal.dismiss({
      'salida':''
    });
  }
  ingresar(salida){
    this.modal.dismiss({
      salida
    });
  }
}
