import { Injectable } from '@angular/core';
import { CommunicationService } from "../communication-service/communication-service";
import { ENV } from 'environments/environment.prod';
import { DomainResponse } from '../../../src/models/sso/DomainResponse';


@Injectable()
export class DomainCheckService {
    constructor(private communicationService: CommunicationService) { }

    public checkDomain(domain: string): Promise<DomainResponse> {
        return new Promise(resolve => {
            this.communicationService.get(ENV.getInitialResponce(domain))
                .then(domainCheck => {
                    let domainResponse = new DomainResponse(domainCheck);
                    resolve(domainResponse);
                })
        });
    }
}