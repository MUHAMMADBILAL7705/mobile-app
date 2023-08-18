import { Injectable } from '@angular/core';
import { CommunicationService } from '../communication-service/communication-service';
import { ENV } from '@app/env';

@Injectable()
export class CompanyService {

  constructor(public communicationService : CommunicationService) {
  }

  public getCompanyDetails(domain): Promise<any> {
  return this.communicationService.get(ENV.getCompanyUrl(domain))
  }
}