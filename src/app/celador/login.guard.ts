import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { DbaService } from '../services/dba.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate  {
  
  constructor(private fireAuth:AngularFireAuth,
    private router:Router,
    private dba:DbaService){

  }
  canActivate(){
    return this.fireAuth.authState.pipe(map(usuario=>{
      if (usuario){
        this.dba.login(usuario.email);
        return true;
      }
      else {
        this.router.navigate(['login']);
        return false;
      }
    }));
  }
}

