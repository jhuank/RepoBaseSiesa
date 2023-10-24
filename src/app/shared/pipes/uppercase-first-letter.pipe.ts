import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'uppercaseFirstLetter'
})
export class UppercaseFirstLetterPipe implements PipeTransform {

    //Coloca primera letra de string en Mayúscula
    transform(val: string, args?) { 
        if(val.length > 0) return val.charAt(0).toUpperCase() + val.slice(1);
        return val; 
    }
}