import {Injectable} from '@angular/core';
import {CommunicationService} from "../communication-service/communication-service";
import {ENV} from '@app/env';
import {CsrxtokenService} from '../csrxtoken-service/csrxtoken-service';

@Injectable()
export class TimeCardService {

  constructor(private communicationService: CommunicationService, private csrxtokenService: CsrxtokenService) {
  }

  public savePunch(punch, domain) {
    return new Promise(resolve => {
      this.csrxtokenService.checkAndUpdateCsrfToken().then(res => {
        if (res) {
          resolve(this.communicationService.post(ENV.savePunchUrl(domain), punch));
        }
      });
    });
  }

  public updateEmployeeTrackLocation(domain,employeeLocationModel) {
    return new Promise(resolve => {
      this.csrxtokenService.checkAndUpdateCsrfToken().then(res => {
        if (res) {
          resolve(this.communicationService.post(ENV.updateEmployeeTrackLocation(domain),employeeLocationModel));
        }
      });
    });



  }
}
