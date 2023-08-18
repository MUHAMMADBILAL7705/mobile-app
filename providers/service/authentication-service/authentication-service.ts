import { Injectable } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { LoginPage } from '../../../pages/login/login';
import { StorageService } from "../../service/storage-service/storage-service";
import { GlobalProvider } from "../../global/global";
/*
  Generated class for the AuthenticationServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AuthenticationServiceProvider {

  constructor(public navCtrl: NavController, public navParams: NavParams, public storageService: StorageService, public global: GlobalProvider) {
  }

  public clearLocalStorageAndSessionData() {
    this.storageService.deleteFromStorage('userData').then(res => {
      this.storageService.deleteFromStorage('timesheet').then(res => {
        this.storageService.deleteFromStorage("tokenData").then(res => this.navCtrl.setRoot(LoginPage))
      })
    })
  }

}
