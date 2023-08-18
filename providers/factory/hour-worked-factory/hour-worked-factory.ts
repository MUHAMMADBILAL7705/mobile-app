import { Injectable } from '@angular/core';
import * as moment from 'moment';

@Injectable()
export class HourWorkedFactory {

  private payTypeId: string = "";

  constructor() { }

  public createDefaultModel(): any {
    return { date: "", hours: "", chargeCodes: [], employeeId: "", payTypeId: "", timesheetId: "", newNotes: "", billable: false, id: "" };
  }

  public createHoursModelForChargeCode(hourWorked, chargeCodes, timesheet, currentDate, zeroHoursModel, leaves, isLeaveAssociaion): any {
    this.payTypeId = "";
    var selectedChargeCodes = this.getSelectedChargeCodes(chargeCodes, leaves, isLeaveAssociaion);
    return this.getHourWorkedModel(hourWorked, selectedChargeCodes, timesheet, currentDate, zeroHoursModel);
  }

  public createHoursModelForLeaves(hourWorked, chargeCode, timesheet, currentDate, zeroHoursModel): any {
    this.payTypeId = "";
    var selectedChargeCode = this.getleavesChargeCode(chargeCode);
    return this.getHourWorkedModel(hourWorked, selectedChargeCode, timesheet, currentDate, zeroHoursModel);
  }

  public populateHoursWorkedModelForEditing(hoursWorked, chargeCodeBeingEdited) {
    hoursWorked.billable = chargeCodeBeingEdited.billable;
    hoursWorked.newNotes = chargeCodeBeingEdited.notes;
    hoursWorked.hours = chargeCodeBeingEdited.hour;
    hoursWorked.id = chargeCodeBeingEdited.id;
    return hoursWorked
  }

  private getHourWorkedModel(hourWorked, selectedChargeCodes, timesheet, currentDate, zeroHoursModel) {
    let selectedChargeCodeIds;
    hourWorked.timesheetId = timesheet.id;
    hourWorked.date = moment(currentDate).format('MM/DD/YYYY');
    hourWorked.chargeCodes = selectedChargeCodes;
    hourWorked.employeeId = timesheet.employee.employeeId;
    hourWorked.payTypeId = this.payTypeId;
    selectedChargeCodeIds = this.getChargeCodesIds(hourWorked);

    zeroHoursModel.forEach(element => {
      if (element.chargeCodeIds == selectedChargeCodeIds) {
        hourWorked.id = element.hourIds;
      }
    });

    return hourWorked;
  }

  private getChargeCodesIds(hoursWorked): any {

    return hoursWorked.payTypeId != null ?
      hoursWorked.chargeCodes.filter(code => code.chargeCodeId != null).map(chargeCode => chargeCode.chargeCodeId).concat(hoursWorked.payTypeId).join() :
      !hoursWorked.leave ? hoursWorked.chargeCodes.filter(code => code.chargeCodeId != null || code.id != null).map(chargeCode => chargeCode.chargeCodeId ? chargeCode.chargeCodeId : chargeCode.id).join() :
        hoursWorked.chargeCodes.filter(code => code.chargeCodeId != null).map(chargeCode => chargeCode.chargeCodeId).join();
  }

  private getSelectedChargeCodes(chargeCodes, leaves, isLeaveAssociaion) {
    var selectedChargeCodes = [];
    chargeCodes.forEach((key, value) => {
      if (value == "Pay Type") {
        this.payTypeId = key.id;
        if (isLeaveAssociaion) {
          selectedChargeCodes.push({ chargeCodeId: key.leaveId ? key.leaveId : key.id ? key.id : key.chargeCodeId ? key.chargeCodeId : null, chargeCodeName: "", type: key.type ? key.type : key.chargeCodeName ? key.chargeCodeName : value, hierarchicalName: "", children: false,isLeaveWithChargeCode : key.isLeaveWithChargeCode });
        }
      }
      else
        selectedChargeCodes.push({ chargeCodeId: key.id ? key.id : key.chargeCodeId ? key.chargeCodeId : null, chargeCodeName: "", type: key.type ? key.type : key.chargeCodeName ? key.chargeCodeName : value, hierarchicalName: "", children: false });
    })
    return selectedChargeCodes;
  }

  private getleavesChargeCode(chargeCode) {
    var selectedChargeCode = [];
    selectedChargeCode.push({
      chargeCodeId: chargeCode ? chargeCode.id ? chargeCode.id : chargeCode.chargeCodeId ? chargeCode.chargeCodeId : null : null, chargeCodeName: chargeCode ? chargeCode.chargeCodeName ? chargeCode.chargeCodeName : chargeCode.name : "",
      children: false, hierarchicalName: chargeCode ? chargeCode.chargeCodeName ? chargeCode.chargeCodeName : chargeCode.name : "", leave: true,
      type: "Leave"
    });
    return selectedChargeCode;

  }
}
