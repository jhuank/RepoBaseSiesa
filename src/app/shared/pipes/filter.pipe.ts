import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(items: any[], term: string, columns?: string[]): any[] {
    return items.filter((item) => {
      const itemString = JSON.stringify(item);

      return itemString.includes(term);
    });
  }

}
