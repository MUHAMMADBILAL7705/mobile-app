import { Injectable } from '@angular/core';
import { ToastController } from 'ionic-angular';

@Injectable()
export class ToasterUtlis {

  constructor(public toastCtrl: ToastController) {
  }
  showError(message: string) {
   this.displayToaster(message, 6000, "top")
  }

  showErrorOnBottom(message: string) {
   this.displayToaster(message, 5000, "bottom")
  }

  showErrorWithButton(message: string) {
    let toast = this.toastCtrl.create({
      message: message,
      position: 'bottom',
      showCloseButton: true,
      cssClass : "{height: 10px}"
    });
    toast.present();
    return toast;
  }

  private displayToaster(message : string, duration : number, position : string){
    let toast = this.toastCtrl.create({
      message: message,
      duration: duration,
      position: position
    });
    toast.present();
  }
}