import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'notificaciones'
})
export class NotificacionesPipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    return null;
  }

}
