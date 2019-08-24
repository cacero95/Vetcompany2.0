import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { VeterinariasPage } from './veterinarias.page';

import { IonicRatingModule } from "ionic4-rating";
const routes: Routes = [
  {
    path: '',
    component: VeterinariasPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IonicRatingModule,
    RouterModule.forChild(routes)
  ],
  declarations: [VeterinariasPage]
})
export class VeterinariasPageModule {}
