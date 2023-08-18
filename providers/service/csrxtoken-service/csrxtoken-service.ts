import { Injectable } from '@angular/core';
import { StorageService } from '../storage-service/storage-service';
import { GlobalProvider } from '../../global/global';
import { LoginService } from '../login-service/login-service';
import * as moment from 'moment-timezone';
import { AlertController } from 'ionic-angular';
import { LoginPage } from '../../../pages/login/login';
import { ToasterUtlis } from '../../../providers/util/toaster-utlis/toaster-utlis';



/*
  Generated class for the CsrxtokenServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class CsrxtokenService {
  rootPage: any;

  constructor(private storageService: StorageService, private global: GlobalProvider,
     private loginService: LoginService, private alertController: AlertController,
     private toasterUtils: ToasterUtlis) {

  }

  public async checkAndUpdateCsrfToken(): Promise<any> {
    return new Promise(async resolve => {
      this.canUpdateToken().then(response => {
        if (response) {
           this.storageService.getFromStorage('appData').then(async appData => {
            if (appData != undefined && appData.loginData != null) {
              await this.loginService.login(this.createLoginModel(appData.loginData)).then(res => {
                if (res.authenticated) {
                  this.storageService.addToStorage('tokenData',{token :res.token, date:  moment(new Date()).format("YYYY-MM-DD HH:mm:ss")});
                  resolve(true);
                }
                else if(res == false){
                  this.toasterUtils.showErrorOnBottom("Unable to connect to the server, try again!")
                }
                else {
                  appData.loginData.keepLoggedIn = false;
                  appData.loginData.password = "";
                  this.storageService.addToStorage('appData', appData);
                  resolve(false);
                  this.showAlert();
                }
              });
            }
            else {
              this.rootPage = LoginPage;
            }
          });
        }
        else {
          resolve(true);
        }
      });

    });
  }

  private canUpdateToken(): Promise<any> {
    return new Promise(resolve => {
      this.storageService.getFromStorage('tokenData').then(tokenData => {
      var currentTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
      var duration = moment.duration(moment(currentTime).diff(moment(tokenData.date)));
      var seconds = duration.asSeconds();
      if (seconds > 1700) {
        resolve(true);
      }
      else {
        resolve(false);
      }
    })
    })


  }

  private showAlert() {
    let alert = this.alertController.create({
      title: 'session expired',
      buttons: ['Dismiss']
    });
    alert.present();
    this.rootPage = LoginPage;
  }

  private createLoginModel(userData) {
    return { email: userData.email, password: userData.password, domain: userData.domain };
  }

}
