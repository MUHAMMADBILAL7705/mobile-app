import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
  HttpResponseBase
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AlertController } from 'ionic-angular';
import 'rxjs/add/operator/do';
import { SpinnerServiceProvider } from '../service/spinner-service/spinner-service';
import { timeout } from 'rxjs/operators';
import { ToasterUtlis } from '../../providers/util/toaster-utlis/toaster-utlis';
import { Network } from '@ionic-native/network';
import { GoogleAnalyticService } from '../service/google-analytic-service/google-analytic-service';

@Injectable()
export class Interceptor implements HttpInterceptor {

  constructor(public alertCtrl: AlertController, private spinnerService: SpinnerServiceProvider,
    private toasterUtils: ToasterUtlis, private network: Network,private googleAnalyticService: GoogleAnalyticService) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
     if (this.isConnetedToInternet()) {
      if (!this.spinnerService.isLoadingInProgress) {
        this.spinnerService.showSpinner();
      }
       this.googleAnalyticService.trackView(request.url);
      return next.handle(request).pipe(timeout(15000)).do((event: HttpEvent<any>) => {
        if (event instanceof HttpResponseBase && this.spinnerService.isLoadingInProgress) {
            this.spinnerService.hideSpinner();
          }
      }, (err: any) => {
        if(!request.url.includes("/app/init"))
          this.handleErrors(err)
        this.spinnerService.hideSpinner();
      });
     }
  };

  private handleErrors(err) {
    if (err.status == 0 || err instanceof Error && err.name === "TimeoutError") {
      this.toasterUtils.showErrorOnBottom("Unable to connect to the server, try again!")
    }
    else if (err instanceof HttpErrorResponse) {
      this.showAlert("Oops! Something went wrong", "Some error occured");
    }
  }

  private showAlert(title: string, message: string) {
    let alert = this.alertCtrl.create({
      title: title,
      message: message,
      cssClass: 'error-alert-login',
      buttons: ['Dismiss']
    });
    alert.present();
  }

  private isConnetedToInternet() {
    return this.network.type != "unknown" && this.network.type != "none";
  }

}



