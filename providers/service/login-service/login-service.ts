import { Injectable } from '@angular/core';
import { CommunicationService } from "../communication-service/communication-service";
import { ENV } from '@app/env';
import { Observable } from 'rxjs/Observable';


@Injectable()
export class LoginService {
  constructor(public communicationService: CommunicationService) {
  }

  public login(loginModel) {
    return this.communicationService.post(ENV.loginUrl(loginModel.domain), loginModel);
  }
  public checkDomain(domain:string): Observable<Boolean> {
    return this.communicationService.getdomain(ENV.domainCheckUrl(domain.toLowerCase()));
  }
  public resetPassword(forgotModel) {
    return this.communicationService.getResetPasswwordLink(ENV.resetPasswordUrl(forgotModel.domain,forgotModel.email));
  }

  public getLocationFeatureToggle(){
    return this.communicationService.getCompanyFeatures();
  }

}
