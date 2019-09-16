import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { DbaService } from '../services/dba.service';
import { Users } from '../models/usuarios/user_pets';

@Injectable({
  providedIn: 'root'
})
export class EntrarRastreoGuard implements CanActivate {
  constructor(private dba:DbaService,
    private router:Router){

  }
  canActivate(){
    let is_mascota:Users = this.dba.getUsuario();
    if (is_mascota){
      if(is_mascota.type == 'mascota'){
        return true;
      }
      else {
        return false;
      }
    }
    else {
      this.router.navigate(['login']);
      return false;
    }
  }
}
