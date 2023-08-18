import { CsrxtokenService } from './../csrxtoken-service/csrxtoken-service';
import { Injectable } from '@angular/core';
import { CommunicationService } from '../communication-service/communication-service';
import { GlobalProvider } from '../../global/global';
import { ENV } from '@app/env';

@Injectable()
export class HoursWorkedService {

  constructor(private communicationService: CommunicationService, public global: GlobalProvider, private csrxtokenService: CsrxtokenService) {
  }

  public getDefaultHourModel(): any {
    return { date: "", hours: "", chargeCodes: [], employeeId: "", payTypeId: "", timesheetId: "", newNotes: "", billable: false, id: "" };
  }

  public saveHours(hourModel, domain) : any {
    return new Promise(resolve => {
      this.global.lastHourEntryDate = hourModel.date;
      this.csrxtokenService.checkAndUpdateCsrfToken().then(res => {
        if (res) {
          resolve(this.communicationService.post(ENV.saveHoursWorkedUrl(domain), hourModel));
        }
      });
    });

  }

  public deleteHours(hourId, domain) {
    return new Promise(resolve => {
      this.csrxtokenService.checkAndUpdateCsrfToken().then(res => {
        if (res) {
          resolve(this.communicationService.post(ENV.deleteHoursWorkedUrl(domain),hourId));
        }
      });
    });
  }

  public getRelatedAssoiciationCopy(associationCopy, selectedChargeCode, selectedChargeList) {
    let temp = [];

    associationCopy.map(association => {
      association.chargeCodes.map((chargeCode, index) => {
        if (index == 0 && chargeCode.name == selectedChargeCode.name && chargeCode.chargeCodeName == selectedChargeCode.chargeCodeName) {
          if (this.checkOrderOfselectedChargeCode(selectedChargeCode, selectedChargeList)) {
            temp.push(Object.assign([], association));
          }
        }
      });
    });
    return temp;
  }

  private checkOrderOfselectedChargeCode(selectedChargeCode, selectedChargeList) {
    let check = true;
    selectedChargeList.forEach((chargeCode, index) => {
      if (selectedChargeCode.order > chargeCode.order) {
        check = false;
        return;
      }
    });
    return check;
  }

}
