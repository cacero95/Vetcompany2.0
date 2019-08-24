import { Component, OnInit } from '@angular/core';
import { NavParams, Platform, PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-imagen-publicacion',
  templateUrl: './imagen-publicacion.component.html',
  styleUrls: ['./imagen-publicacion.component.scss'],
})
export class ImagenPublicacionComponent implements OnInit {

  imagen:string;
  constructor(private params:NavParams,
    private platform:Platform,
    private pop:PopoverController) { }

  ngOnInit() {
    this.platform.ready().then(()=>{
      this.imagen = this.params.get('imagen');
    })
  }
  close(confirmacion){
    this.pop.dismiss({
      confirmacion
    })
  }
}
