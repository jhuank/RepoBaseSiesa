import { Pipe, PipeTransform } from '@angular/core';
import { orderBy } from 'lodash';

@Pipe({
  name: 'sortBy'
})
export class SortByPipe implements PipeTransform {

  transform(data: any[], orders: (boolean | 'asc' | 'desc')[], columns: string[]): any[] {
    if (!data || data.length <= 1) { return data; }
    
    return orderBy(data, columns, orders);
  }
}
