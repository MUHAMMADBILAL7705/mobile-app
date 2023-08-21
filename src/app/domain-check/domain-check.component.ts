import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavParams, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
// import * as moment from 'moment';

import { GlobalProvider } from '../../../providers/global/global';
import { CompanyService } from '../../../providers/service/company-service/company-service';
import { StorageService } from '../../../providers/service/storage-service/storage-service';
// import { TimehseetConfigurationService } from '../../../providers/service/timehseet-configuration-service/timehseet-configuration-service';
// import { SingleSignOnService } from '../../../providers/service/single-sign-on-service/single-sign-on-service';
import { DomainCheckService } from '../../../providers/service/domain-check-service/domain-check-service';

@Component({
  selector: 'page-domain-check',
  templateUrl: 'domain-check.component.html',
})
export class DomainCheck implements OnInit {

  formGroup!: FormGroup;
  formSubmitted : boolean = false;

  constructor(public navParams: NavParams, public formBuilder: FormBuilder,
    public alertController: AlertController, private domainCheckService: DomainCheckService,
    // private singleSignOnService: SingleSignOnService,
    private storageService: StorageService,
    public globalProvider: GlobalProvider, private companyService: CompanyService,
    // private timesheetConfigurationService: TimehseetConfigurationService,
    private router: Router) {
  }

  ngOnInit() {
    this.setupForm();
    this.getUserDataFromStorage();
  }

  public checkDomain() {
    this.formSubmitted = true;
    this.domainCheckService.checkDomain(this.getDomainName())
      .then((res: { isValidDomain: () => any; ssoEnabled: any; }) => {
        if (res.isValidDomain()) {
          // this.addDomainToStorage();
          if (res.ssoEnabled) {
            // this.singleSignOnService.loginViaSSO(this.getDomainName())
            //   .then((response: any) => {
            //     let responseModel: any = response;
            //     responseModel.ssoEnabled = res.ssoEnabled;
            //     if (responseModel.authenticated) this.addUserDetailToStorage(responseModel);
            //     else this.router.navigate([]);
            //   });
          }
          else {
            this.router.navigate(['login']);
          }
        }
        else
          this.showAlertIncorrecdDomain();
      });
  }

  // private addDomainToStorage() {
  //   var appData = { companyData: { timeZone: "" }, loginData: {}, userData: {}, timesheetConfiguration: {} };
  //   appData.loginData = this.getLoginFormData("");
  //   this.storageService.addToStorage('appData', appData);
  // }

  private setupForm() {
    this.formGroup = this.formBuilder.group({
      domain: ['', Validators.required],
      subDomain: ['.hourtimesheet.com']
    });
  }

  private async showAlertIncorrecdDomain() {
    let alert = this.alertController.create({
      header: 'Domain Name is incorrect',
      buttons: ['Dismiss']
    });
    (await alert).present();
  }

  private getDomainName(): any {
    return this.formGroup?.controls['domain'].value.toLowerCase().replace(/\s/g, "");
  }

  // private addUserDetailToStorage(userDataFromServer: { domain?: any; ssoEnabled?: any; employeeTimezone?: any; email?: any; token?: any; }) {
  //   userDataFromServer.domain = this.formGroup?.controls['domain'].value.replace(/\s/g, "");
  //   var appData = { companyData: { timeZone: "" }, loginData: {}, userData: {}, timesheetConfiguration: {}, ssoEnabled: false };
  //   if (userDataFromServer != null && userDataFromServer != undefined) {
  //     this.companyService.getCompanyDetails(userDataFromServer.domain).then((companyData: { timeZone: any; }) => {
  //       let companyName = this.formGroup?.controls['domain'].value.toLowerCase().replace(/\s/g, "");
  //       this.timesheetConfigurationService.findTimesheetConfiguration(companyName).then((configuration: {}) => {
  //         appData.companyData = companyData;
  //         appData.ssoEnabled = userDataFromServer.ssoEnabled;
  //         appData.companyData.timeZone = userDataFromServer.employeeTimezone != null ? userDataFromServer.employeeTimezone : companyData.timeZone;
  //         appData.timesheetConfiguration = configuration;
  //         appData.loginData = this.getLoginFormData(userDataFromServer.email);
  //         this.globalProvider.company = companyName;
  //         appData.userData = userDataFromServer;
  //         this.storageService.addToStorage('appData', appData);
  //         this.storageService.addToStorage("tokenData", {
  //           token: userDataFromServer.token,
  //           date: moment(new Date()).format("YYYY-MM-DD HH:mm:ss")
  //         });
  //         this.router.navigate([]);
  //       })
  //     });
  //   }
  // }

  private getLoginFormData(email: string): any {
    return {
      domain: this.formGroup?.controls['domain'].value.toLowerCase().replace(/\s/g, ""),
      email: email,
      password: "",
      keepLoggedIn: true
    };
  }

  private getUserDataFromStorage() {
    this.storageService.getFromStorage('appData').then((res: { loginData: { domain: any; } | null; } | null) => {
      if (res != null && res.loginData != null) {
        this.formGroup?.controls['domain'].setValue(res.loginData.domain);
      }
    });
  }

}

