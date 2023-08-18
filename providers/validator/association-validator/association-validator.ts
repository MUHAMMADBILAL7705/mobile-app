import { Injectable } from '@angular/core';
import { CustomUtils } from '../../util/custom-utils/custom-utils';

@Injectable()
export class AuthorizeChargeValidator {

  constructor(public customUtil: CustomUtils) { }

  public validate(hoursWorked, timesheet, currentDayHours, leaveAssociation): boolean {
    if ((timesheet.employee.authorizeChargeAssociationModel != null || timesheet.employee.authorizeLeaveAssociationModel != null) 
    &&( timesheet.employee.authorizeChargeAssociationModel.length > 0 || timesheet.employee.authorizeLeaveAssociationModel.length > 0)) {
      if (leaveAssociation && this.ifOnlyLeaveSelected(hoursWorked.chargeCodes)) {
        return true;
      } else {
        return this.isValidAssocaition(hoursWorked, timesheet, leaveAssociation) && this.validateDuplicateHour(hoursWorked, currentDayHours);
      }
    }
    else {
      return this.validateDuplicateHour(hoursWorked, currentDayHours) && this.isValidCustomerJobSelection(hoursWorked, timesheet);
    }
  }
  private ifOnlyLeaveSelected(codes: any): boolean {
    let filteredCodes = codes.filter(code => {
      return code.chargeCodeId != null
    });
    return filteredCodes.length == 1 && filteredCodes[0].type == "Leave" && !filteredCodes[0].isLeaveWithChargeCode;
  }

  public validateUpdatedChargeCode(hoursWorked, timesheet, currentDayHours, editedChargeCodeCopy, leaveAssociation) {
    if ((timesheet.employee.authorizeChargeAssociationModel != null || timesheet.employee.authorizeLeaveAssociationModel != null) 
    &&( timesheet.employee.authorizeChargeAssociationModel.length > 0 || timesheet.employee.authorizeLeaveAssociationModel.length > 0)) {
      if (leaveAssociation && this.ifOnlyLeaveSelected(hoursWorked.chargeCodes)) {
        return true;
      } else {
        return this.isValidAssocaition(hoursWorked, timesheet, leaveAssociation) && this.validateEditedChrageCodeDuplication(hoursWorked, currentDayHours, editedChargeCodeCopy);
      }
    }
    else {
      return this.validateEditedChrageCodeDuplication(hoursWorked, currentDayHours, editedChargeCodeCopy) && this.isValidCustomerJobSelection(hoursWorked, timesheet);
    }
  }

  public validateDuplicateHour(hourWorked, currentDayHours): boolean {
    let error: boolean = true;
    let selectedCodes = this.getAuthorizeCharges(hourWorked);
    if (currentDayHours.filter(hour => this.getAuthorizeCharges(hour) == selectedCodes
    ).length > 0) {
      error = false;
      throw new Error("You cannot enter hours againts same charge codes");
    }
    return error;
  }

  public validateEditedChrageCodeDuplication(hourWorked, currentDayHours, editedChargeCodeCopy): boolean {
    let error: boolean = true;
    let editchargeCopy = this.getChargeCodeForEditCopy(editedChargeCodeCopy);
    let selectedCodes = this.getAuthorizeCharges(hourWorked);
    if (currentDayHours.filter(hour => this.getAuthorizeCharges(hour) == selectedCodes && this.getAuthorizeCharges(hour) != editchargeCopy
    ).length > 0) {
      error = false;
      throw new Error("You cannot enter hours againts same charge codes");
    }
    return error;
  }

  public validateDuplicateHourInLeave(hourWorked, currentDayHours): boolean {
    let error: boolean = true;
    let selectedLeave = hourWorked.chargeCodes[0].chargeCodeId;
    if (currentDayHours.filter(hour => this.getAuthorizeCharges(hour) == selectedLeave
    ).length > 0) {
      error = false;
      throw new Error("You cannot select same leave multiple times");
    }
    return error;
  }
  public validateDuplicateHourInLeaveForEdit(hourWorked, currentDayHours, leaveCopy): boolean {
    let error: boolean = true;
    let editedLeaveCopy = leaveCopy.chargeCodeId;
    let selectedLeave = hourWorked.chargeCodes[0].chargeCodeId;
    if (currentDayHours.filter(hour => this.getAuthorizeCharges(hour) == selectedLeave && this.getAuthorizeCharges(hour) != editedLeaveCopy
    ).length > 0) {
      error = false;
      throw new Error("You cannot select same leave multiple times");
    }
    return error;
  }

  private isValidCustomerJobSelection(hourWorked, timesheet): boolean {
    let result = true;
    let customer = hourWorked.chargeCodes.filter(code => code.type == "Customer")[0];
    let customerJob = hourWorked.chargeCodes.filter(code => code.type == "Job")[0];
    let customers = timesheet.employee.employeeChargeCodeModel.chargeCodes.filter(employeeCode => employeeCode.codesType == "Customer")[0];
    if ((customer != null && customer.chargeCodeId != null) || (customerJob != null && customerJob.chargeCodeId != null)) {
      let customerFromDb = customers.chargeCodes.filter(cust => cust.id == customer.chargeCodeId)[0];
      if (this.isInValidChild(customerFromDb, customerJob)) {
        result = false;
        throw new Error("Please select Customer Job");
      }
    }
    return result;
  }

  private isInValidChild(customerFromDb, children): boolean {
    return (customerFromDb.children == null && customerFromDb.children.length == 0) ? false :
      (customerFromDb.children != null && customerFromDb.children.length > 0) && children == null;
  }



  private isValidAssocaition(hoursWorked, timesheet, leaveAssociation): boolean {
    let error: boolean = true;
    let selectedCodes = this.getAuthorizeCharges(hoursWorked);
    //if(this.checkAssosication(timesheet,hoursWorked))
    if (this.getAssociationIds(timesheet, leaveAssociation).get(selectedCodes) == null) {
      error = false;
      throw new Error("Selected charge codes does not exist");
    }
    return error;
  }

  private getAuthorizeCharges(hoursWorked): any {
    let result = hoursWorked.payTypeId != null ?
      hoursWorked.chargeCodes.filter(code => code.chargeCodeId != null && code.type != "Leave").map(chargeCode => chargeCode.chargeCodeId).concat(hoursWorked.payTypeId).join() :
      !hoursWorked.leave ? hoursWorked.chargeCodes.filter(code => code.chargeCodeId != null || code.id != null).map(chargeCode => chargeCode.chargeCodeId ? chargeCode.chargeCodeId : chargeCode.id).join() :
        hoursWorked.chargeCodes.filter(code => code.chargeCodeId != null).map(chargeCode => chargeCode.chargeCodeId).join();
    return this.customUtil.stringBefore(result, ',');

  }
  private getChargeCodeForEditCopy(copy) {
    return copy.filter(code => code.chargeCodeId != null || code.id != null).map(chargeCode => chargeCode.chargeCodeId ? chargeCode.chargeCodeId : chargeCode.id).join();
  }

  private getAssociationIds(timesheet, leaveAssociation) {
    return this.createAssociationIdsMap(leaveAssociation ? timesheet.employee.authorizeLeaveAssociationModel : timesheet.employee.authorizeChargeAssociationModel);
  }

  public createAssociationIdsMap(associations): any {
    let associationsMap = new Map<String, any>();
    associations.forEach(association => {
      let assocaitionIds = association.chargeCodes.map(code => code.id);
      if (association.payTypeModel != null) {
        assocaitionIds.push(association.payTypeModel.id);
      }
      associationsMap.set(assocaitionIds.join(), association);
    })
    return associationsMap;
  }

  public validateChargeCodeAssociationForJobTracking(selectedChargeCodes, allAssociations): boolean {
    let allAssociationIdMap = this.createAssociationIdsMap(allAssociations);
    let selectedChargeCodeIds = this.getIdsString(selectedChargeCodes);
    let selectedAssociation = allAssociationIdMap.get(selectedChargeCodeIds);
    if (selectedAssociation == null) {
      throw new Error("Selected charge codes does not exist")
    }
    return selectedAssociation;
  }

  private getIdsString(SelectedChargeCodes) {
    let idsList = [];
    SelectedChargeCodes.forEach(code => {
      if (code.id != "") {
        idsList.push(code.id);
      }
    });
    return idsList.toString();
  }
}
