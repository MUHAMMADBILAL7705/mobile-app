import { Injectable } from '@angular/core';

/*
  Generated class for the GlobalProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class GlobalProvider {

  public token!: string;
  public date!: string;
  public company!: string;
  public lastHourEntryDate!: string;
  public selectedTabIndex: number = 0;
  public currentDay!: String;
  constructor() {
  }




}
