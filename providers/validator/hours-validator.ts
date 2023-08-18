import { Injectable } from '@angular/core';
import { AuthorizeChargeValidator } from "./association-validator/association-validator";

@Injectable()
export class HoursValidator {

  constructor(public authorizeChargeValidator: AuthorizeChargeValidator) { }

  public isValid(timesheet, hourWorked, currentDayHours,leaveAssociation): boolean {
    return this.authorizeChargeValidator.validate(hourWorked, timesheet, currentDayHours,leaveAssociation)
     && this.isValidHour(hourWorked) && this.isValidPayTypye(hourWorked, timesheet) && this.hasChargeCodes(hourWorked);
  }

  public validateUpdatedChargeCode(timesheet, hourWorked, currentDayHours,editedChargeCodeCopy,leaveAssociation){
    return this.authorizeChargeValidator.validateUpdatedChargeCode(hourWorked, timesheet, currentDayHours,editedChargeCodeCopy,leaveAssociation)
     && this.isValidHour(hourWorked) && this.isValidPayTypye(hourWorked, timesheet) && this.hasChargeCodes(hourWorked);
  }


  public isValidLeaveHours(timesheet, hourWorked, currentDayHours){
    return this.isValidHour(hourWorked) && this.hasLeave(hourWorked)&&this.authorizeChargeValidator.validateDuplicateHourInLeave(hourWorked,currentDayHours)
  }
  public isValidLeaveHoursForEdit(timesheet, hourWorked, currentDayHours,leaveCopy){
    return this.isValidHour(hourWorked) && this.hasLeave(hourWorked)&&this.authorizeChargeValidator.validateDuplicateHourInLeaveForEdit(hourWorked,currentDayHours,leaveCopy)
  }

  public isValidHour(hourWorked): boolean {
    var error: boolean = true;
    if (hourWorked.hours == '' || hourWorked.hours == null) {
      error = false;
      throw new Error("Please Enter Hour(s).");
    }

    if (hourWorked.hours > 24) {
      error = false;
      throw new Error("Hours must not be greater than 24");
    }
    return error;
  }

  private isValidPayTypye(hourWorked, timesheet): boolean {
    var error: boolean = true;
    var payTypes = timesheet.employee.payTypeModels;
    if (payTypes != null && payTypes.length > 0 && hourWorked.payTypeId == null) {
      error = false;
      throw new Error("Pay Type is required");
    }
    return error;
  }

    private hasChargeCodes(hourWorked): boolean {
    var error: boolean = false;
    hourWorked.chargeCodes.forEach(element => {
      if(element.chargeCodeId !=null )
      {
        error = true;
      }
    });
    if (!error) {
      throw new Error("Please select charge code");
    }
    return error;
  }


  private hasLeave(hourWorked){
    var error: boolean = false;
    hourWorked.chargeCodes.forEach(element => {
      if(element.chargeCodeId !=null )
      {
        error = true;
      }
    });
    if (!error) {
      throw new Error("Please select leave");
    }
    return error;
  }
}
