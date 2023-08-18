import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GlobalProvider } from '../../global/global';
/*
  Generated class for the CustomUtilsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class CustomUtils {

  constructor(public http: HttpClient, public global: GlobalProvider) {

  }

  public isObjectEmpty(obj: Object): boolean {
    return Object.keys(obj).length == 0;
  }

  public deepCopyArrayObejct(array: any[]) {
    return array.map(x => Object.assign({}, x));
  }
  public sortHeaders(obj: any[]) {
    obj.sort((a, b) => {
      let c
      if (a.order && b.order || (a.order && b.order == 0) || (b.order && a.order == 0)) {
        c = parseInt(b.order) - parseInt(a.order);
        return c;
      }

      !a.order ? c = -1 : c = 0
      !b.order ? c = 1 : c = 0
      return c;

    });
    return obj.reverse();
  }

  public DuplicateObject(obj: object) {
    return Object.assign({}, obj);
  }

  public replaceString(str: string, itemToSearch: string, itemToReplace: string): string {
    return str.replace(new RegExp(itemToSearch, 'g'), itemToReplace)
  }

  public stringBefore(stringToBeChecked,stringToBeRemoved):string{
    return stringToBeChecked.endsWith(stringToBeRemoved)?stringToBeChecked.slice(0,-1):stringToBeChecked;
  }

  public sortHeadersOnTheBasisOfOrderKey (headers): void{
    let heighestOrder = 0;
    let hasPayType= false;
    let indexOfPayType;
    headers.forEach((code, index)=>{
      if(code.order > heighestOrder){
        heighestOrder =code.order;
      }
      if(code.order == undefined){
        hasPayType =true;
        indexOfPayType = index;
      }
    })

    if(hasPayType){
      headers[indexOfPayType].order = heighestOrder +1;
    }
    headers.sort((a,b)=>{
      return a.order -b.order;
    })
  }
}
