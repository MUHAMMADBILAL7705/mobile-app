import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the SortingUtilsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class SortingUtilsProvider {

  constructor(public http: HttpClient) {

  }

  public SortArrayObjectsByPropAlphaNum(property) {
    return (a, b) => {
      var reA = /[^a-zA-Z]/g;
      var reN = /[^0-9]/g;
      var aA = a[property].replace(reA, '');
      var bA = b[property].replace(reA, '');
      if (aA === bA) {
        var aN = parseInt(a[property].replace(reN, ''), 10);
        var bN = parseInt(b[property].replace(reN, ''), 10);
        return aN === bN ? 0 : aN > bN ? 1 : -1;
      }
      else {
        return a[property] > b[property] ? 1 : -1;
      }
    }
  }
}