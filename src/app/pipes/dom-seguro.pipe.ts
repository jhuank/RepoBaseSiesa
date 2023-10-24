import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from "@angular/platform-browser";

@Pipe({
  name: 'domSeguro'
})

export class DomSeguroPipe implements PipeTransform {

  constructor(private _domSanitizer:DomSanitizer){}
  
  transform(html: string): any { 
    return this._domSanitizer.bypassSecurityTrustHtml(html);    
  }

}
