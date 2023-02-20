import { Injectable } from '@angular/core';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dashifyNames'
})
@Injectable({
  providedIn: 'root'
})
export class DashifyNamesPipe implements PipeTransform {

  transform(value: string): string {
    return value.replace(/[^A-Za-z0-9]/g, '-').toLowerCase();
  }

}
