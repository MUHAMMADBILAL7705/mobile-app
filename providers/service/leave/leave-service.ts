import { Injectable } from '@angular/core';
import { ENV } from "@app/env";
import { LeaveBalanceRequestModel } from "../../../models/leave/LeaveBalanceRequestModel";
import * as moment from 'moment-timezone';
import { CommunicationService } from "../communication-service/communication-service";
import { CreateLeaveRequestModel } from 'models/leave/CreateLeaveRequestModel';
import { CsrxtokenService } from '../csrxtoken-service/csrxtoken-service';

@Injectable()
export class LeaveService {

  constructor(private communicationService: CommunicationService,
    private csrxtokenService: CsrxtokenService) {
  }

  public getLeaveBalances(domain: String, employeeId: String): any {
    return new Promise(resolve => {
      this.csrxtokenService.checkAndUpdateCsrfToken().then(res => {
        if (res) {
          let now = moment(new Date()).format("MM/DD/YYYY");
          resolve(this.communicationService.get(ENV.leaveBalanceURL(domain), new LeaveBalanceRequestModel(employeeId, now, now)));
        }
      });
    });
  }

  public createLeaveRequest(domain: String, employeeId: String, leaveRequest: CreateLeaveRequestModel): any {
    return new Promise(resolve => {
      this.csrxtokenService.checkAndUpdateCsrfToken().then(res => {
        if (res) {
          resolve(this.communicationService.post(ENV.addleaveRequestURL(domain, employeeId), leaveRequest));
        }
      });
    });
  }

  public getLeaveRequestsByEmployee(domain: String, employeeId: String): any {
    return new Promise(resolve => {
      this.csrxtokenService.checkAndUpdateCsrfToken().then(res => {
        if (res) {
          resolve(this.communicationService.get(ENV.getLeaveRequestsByEmployeeURL(domain, employeeId)));
        }
      });
    });
  }

  public cancelLeaveRequest(employeeId: String, leaveRequestId: String, companyName: string): any {
    return new Promise(resolve => {
      this.csrxtokenService.checkAndUpdateCsrfToken().then(res => {
        if (res) {
          resolve(this.communicationService.post(ENV.cancelLeaveRequestByEmployeeURL(companyName, employeeId, leaveRequestId)));
        }
      });
    });
  }

}
