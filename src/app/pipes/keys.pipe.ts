import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'keys'
})
export class KeysPipe implements PipeTransform {
  transform(values: any): any {
    const keys = [];
    for (const key in values) {
      if (values.hasOwnProperty(key)) {
        keys.push({ key, value: values[key]});
      }
    }
    return keys;
  }
}
