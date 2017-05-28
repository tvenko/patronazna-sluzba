import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'material'})
export class MaterialPipe implements PipeTransform {
  transform(value: any): any {
    return JSON.stringify(value, null, 2)
      .replace(' ', '&nbsp;')
      .replace('{', '')
      .replace('}', '')
      .replace('\n', '<br/>');
  }
}
