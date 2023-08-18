import { Injectable } from '@angular/core';
import { CommunicationService } from "../communication-service/communication-service";
import { ENV } from '@app/env';

@Injectable()
export class TimehseetConfigurationService {

  constructor(private communicationService: CommunicationService) {
  }

  public findTimesheetConfiguration(companyName): any {
    return this.communicationService.get(ENV.getTimesheetConfigurationUrl(companyName));
  }

}
