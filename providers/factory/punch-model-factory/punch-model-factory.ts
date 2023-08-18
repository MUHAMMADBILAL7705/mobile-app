import { Injectable } from '@angular/core';
import * as moment from 'moment-timezone';

@Injectable()
export class PunchModelFactory {

  constructor() { }
  currentDate:any;
  selectedDate:any;

  public create(punches,startDate, companyTimeZone): any {
      this.verifyClockOutDate(punches,startDate);
      let LastPunchDateTime = this.getLastSavedInPunchDate(punches); 
      let punchDate = LastPunchDateTime == "" ? moment(new Date(),companyTimeZone).format('MM/DD/YYYY'): LastPunchDateTime.split(" ")[0];
      let punchDateTime = LastPunchDateTime == "" ? moment(new Date(),companyTimeZone).format('MM/DD/YYYY HH:mm a') : LastPunchDateTime;
    return {
      "status": this.getPunchStatus(punches),
      "date": moment(punchDate).format('dddd, MMM D, YYYY'),
      "dateTime" : punchDateTime,
      "time": this.getPunchTime(punches, companyTimeZone),
      "btnStatus": this.getStateByLastPunch(punches),
      "dateForDurationUse": punchDate,
      "authorizeCharge": this.getLastPunchChargeCodes(punches)
    };
  }

  private verifyClockOutDate(punches, startDate): any {
    let abort: boolean = false;
    let systemDate = moment(new Date()).format('MM/DD/YYYY');
    let checkTimesheetChangeDate = new Date();
    let timesheetChangeDate = checkTimesheetChangeDate.setDate(checkTimesheetChangeDate.getDate() - 1);
    let setTimesheetChangeDate = moment(timesheetChangeDate).format('MM/DD/YYYY');
    let checkDate = new Date();
    if (punches[systemDate] == "" && punches[setTimesheetChangeDate] != undefined) {
      for (let previousDate = checkDate.setDate(checkDate.getDate() - 1); moment(previousDate).isSameOrAfter(startDate) && !abort;) {
        this.selectedDate = moment(previousDate).format('MM/DD/YYYY');
        if (punches[this.selectedDate] == "") {
          this.currentDate = moment(new Date()).format('MM/DD/YYYY');
        }
        else {
          punches[this.selectedDate].forEach(element => {
            if (element.outPunch.id == null) {
              this.currentDate = this.selectedDate;
              abort = true;
            }
            else {
              this.currentDate = moment(new Date()).format('MM/DD/YYYY');
              abort = true;
            }
          });

        }
        previousDate = checkDate.setDate(checkDate.getDate() - 1);
      }

    }
    else {
      return this.currentDate = moment(new Date()).format('MM/DD/YYYY');
    }

  }


  private getPunchTime(punches, companyTimeZone): string {
    var lastInPunchTime = this.getLastSavedInPunchTime(punches);
   let systemTime=moment(new Date()).tz(companyTimeZone).format('hh:mm a');
    return lastInPunchTime != "" ? lastInPunchTime : systemTime;
  }

  private getLastSavedInPunchTime(punches): any {
    var lastInPunchTime = "";
    var currentDayPunches = punches[this.currentDate]
    currentDayPunches.forEach(punchModel => {
      if (punchModel.inPunch.id != null && punchModel.outPunch.id == null)
        lastInPunchTime = punchModel.inPunch.punchDate;
    });
    return lastInPunchTime;
  }

  private getLastSavedInPunchDate(punches): any {
    var lastInPunchTime = "";
    var currentDayPunches = punches[this.currentDate]
    currentDayPunches.forEach(punchModel => {
      if (punchModel.inPunch.id != null && punchModel.outPunch.id == null)
        lastInPunchTime = punchModel.inPunch.date;
    });
    return lastInPunchTime;
  }

  private getPunchStatus(punches) {
    let punchStatus = "Off the clock";
    var currentDayPunches = punches[this.currentDate]
    currentDayPunches.forEach(punchModel => {
      if (punchModel.inPunch.id != null && punchModel.outPunch.id == null)
        punchStatus = "Clocked In";
    })
    return punchStatus;
  }

  

  private getStateByLastPunch(punches): string {
    var lastStatus = "Clock In";
    var currentDayPunches = punches[this.currentDate]
    currentDayPunches.forEach(punchModel => {
      if (punchModel.inPunch.id == null)
        lastStatus = "Clock In";
      else if (punchModel.outPunch.id == null)
        lastStatus = "Clock Out";
    })
    return lastStatus;
  }

  private getLastPunchChargeCodes(punches): any {
    let authorizeCharges = { "chargeCodes": [], "payType": {}, "authorizeChargeName": "", "punch": {} };
    var chargeCode = "";
    var currentDayPunches = punches[this.currentDate]
    currentDayPunches.forEach(punchModel => {
      if (punchModel.inPunch.id != null && punchModel.outPunch.id == null) {
        authorizeCharges.chargeCodes = punchModel.inPunch.chargeCodes;
        authorizeCharges.payType = punchModel.inPunch.payType;
        authorizeCharges.punch = punchModel.inPunch;
        chargeCode = this.getFormatedChargeCode(punchModel.inPunch.chargeCodes, punchModel.inPunch.payType);
      }
    })

    authorizeCharges.authorizeChargeName = chargeCode;
    return authorizeCharges;
  }

  getFormatedChargeCode(chargeCodes, payType): any {
    let charges: string = "";
    for (let chargeCode of chargeCodes) {
      if (chargeCode.hierarchicalName == "" && chargeCode.name != null) {
        charges = this.updateChargeCodeName(charges, chargeCode.name);
      }
      else if (!chargeCode.child && chargeCode.hierarchicalName != null) {
        charges = this.updateChargeCodeName(charges, chargeCode.hierarchicalName.replace(new RegExp(':', 'g'), " > "));
      }
    }
    if (payType != null && payType.id != null) {
      charges = this.updateChargeCodeName(charges, payType.name);
    }
    return charges;
  }

  private updateChargeCodeName(charges: string, chargeCodeName: string) {
    return charges.length > 0 ? charges += " > " + chargeCodeName : charges = chargeCodeName;
  }
}
