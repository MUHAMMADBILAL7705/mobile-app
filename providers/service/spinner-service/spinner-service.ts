
import { Injectable } from '@angular/core';
import { LoadingController } from 'ionic-angular';
/*
  Generated class for the SpinnerServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class SpinnerServiceProvider {

  public isLoadingInProgress: boolean;
  public loading: any;
  constructor( public loadingCtrl: LoadingController) {
  }
  ngOnInit() {
   this.isLoadingInProgress = false;
  }

  public showSpinner() {
    this.isLoadingInProgress = true;
    this.loading = this.loadingCtrl.create({
      content: '',
      spinner: 'ios',
      cssClass: 'my-loading-class'
    });
    this.loading.present();
  }
  public hideSpinner() {
    this.isLoadingInProgress = false;
    this.loading.dismiss();
    this.loading.onDidDismiss(() => {
      console.log('Dismissed loading');
    });
  }
}
