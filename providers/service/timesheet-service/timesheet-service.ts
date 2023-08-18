import { CsrxtokenService } from './../csrxtoken-service/csrxtoken-service';
import { Injectable } from '@angular/core';
import { ActionSheetController, AlertController } from 'ionic-angular';
import { ModalController } from 'ionic-angular';
import { ChargeCodeTransformer } from "../../transformer/charge-code-transformer/charge-code-transformer";
import { LeavesFilter } from "../../util/leaves-filter/leaves-filter";
import { StorageService } from "../storage-service/storage-service";
import { HourWorkedPage } from "../../../pages/hour-worked/hour-worked";
import { LeavesPage } from "../../../pages/leaves/leaves";
import { CommunicationService } from "../communication-service/communication-service";
import * as moment from 'moment';
import { GlobalProvider } from '../../global/global';
import { ToasterUtlis } from '../../util/toaster-utlis/toaster-utlis';
import { SpinnerServiceProvider } from '../spinner-service/spinner-service';
import { ENV } from 'environments/environment.prod';
import { PayTypeModel } from '../../../models/payType/PayTypeModel';

@Injectable()
export class TimesheetService {
  private chargeCodeTransformer: ChargeCodeTransformer;

  constructor(public actionSheetCtrl: ActionSheetController, public spinnerService: SpinnerServiceProvider,
    public globalProvider: GlobalProvider, public alertCtrl: AlertController,
    public modalCtrl: ModalController, chargeCodeTransformer: ChargeCodeTransformer,
    private toaster: ToasterUtlis, private leavesFilter: LeavesFilter, public storageService: StorageService, private communicationService: CommunicationService, private csrxtokenService: CsrxtokenService) {
    this.chargeCodeTransformer = chargeCodeTransformer;
  }

  public getTimesheetByDate(date, companyName): Promise<any> {
    return new Promise(resolve => {
      this.csrxtokenService.checkAndUpdateCsrfToken().then(res => {
        if (res) {
          var selectedDay = date == undefined ? moment().format('YYYY-MM-DD') : moment(date).format('YYYY-MM-DD');
          this.storageService.addToStorage('currentDate', selectedDay);
          this.globalProvider.currentDay = selectedDay;
          resolve(this.communicationService.get(ENV.getTimesheetUrl(companyName, selectedDay)));
        }
      });
    });
  }

  openModal(timesheetModel) {
    let modal = this.modalCtrl.create(HourWorkedPage, timesheetModel);
    modal.present();
  }

  openLeavesModal(leaveModel) {
    let modal = this.modalCtrl.create(LeavesPage, leaveModel);
    modal.present();
  }

  public getNotesToBeDisplayed(hours) {
    let tempNotes = [];
    if (hours.notesList.length > 0) {
      hours.notesList.forEach(obj => {
        tempNotes.push(obj);
      });
    }
    return tempNotes;
  }

  private getLeavePayTypeModels(leaves : any){
    return leaves.map(leave => {
      return new PayTypeModel(leave);
    });
  }

  public createTimeSheetModel(timesheet, currentDayHours, zeroHoursModel, hour, trackLeaveWithChargeCodes) {
    this.storageService.getFromStorage('currentDate').then(res => {
      if (res != undefined) {
        let leaves = this.leavesFilter.filterLeavesOnCurrentDate(timesheet.employee.leaveModels, res);
        let assignedAssociations = trackLeaveWithChargeCodes ? timesheet.employee.authorizeLeaveAssociationModel : timesheet.employee.authorizeChargeAssociationModel;
        let allChargeCodes = timesheet.employee.employeeChargeCodeModel.chargeCodes;
        let chargeCode = assignedAssociations && assignedAssociations.length > 0 ? this.chargeCodeTransformer.transform(assignedAssociations, res) : this.chargeCodeTransformer.transformToModel(allChargeCodes, timesheet.employee.payTypeModels);
        let associationsExist = assignedAssociations && assignedAssociations.length > 0;
        if (trackLeaveWithChargeCodes) {

          if (associationsExist || chargeCode.length > 0) {
            assignedAssociations.forEach(association => {
              leaves.forEach(leave => {
                if (association.payTypeModel != null && leave.payTypeId == association.payTypeModel.id) {
                  leave.isLeaveWithChargeCode = true;
                }
                else if (!leave.isLeaveWithChargeCode) {
                  leave.isLeaveWithChargeCode = false;
                }
              });
            });
            chargeCode.forEach(element => {
              if (element.chargeCodeName == "Pay Type") {
                element.chargeCodes = this.getLeavePayTypeModels(leaves);
              }
            });
          }
          else {
            chargeCode.push({ chargeCodeName: "Pay Type", chargeCodes: this.getLeavePayTypeModels(leaves), order: 6 });
          }
        }
        this.openModal({
          timesheetModel: {
            'chargeCodes': chargeCode,
            'timesheet': timesheet,
            'currentDate': res,
            'currentDayHours': currentDayHours,
            'associationsExist': associationsExist,
            'zeroHoursModel': zeroHoursModel,
            'trackLeaveWithChargeCodes': trackLeaveWithChargeCodes,
            'leaves': leaves
          },
          editedChargeCode: {
            'id': hour ? hour.hourIds : "",
            "chargeCodes": hour ? hour.chargeCodes : "",
            "billable": hour ? hour.billable : false,
            "hour": hour ? hour.hour : "",
            "notes": hour ? hour.notes.length > 0 ? hour.notes.reverse()[0].note : "" : "",
            "isEditable": hour ? true : false,
          }
        }
        )
      }
    })

  }

  public getFormattedChargeCodes(timesheet): any {
    let assignedAssociations = timesheet.employee.authorizeChargeAssociationModel;
    let allChargeCodes = timesheet.employee.employeeChargeCodeModel.chargeCodes;
    let chargeCode = assignedAssociations && assignedAssociations.length > 0 ? this.chargeCodeTransformer.transform(assignedAssociations, moment().format("YYYY-MM-DD")) : this.chargeCodeTransformer.transformToModel(allChargeCodes, timesheet.employee.payTypeModels);
    let associationsExist = assignedAssociations && assignedAssociations.length > 0;
    return { codes: chargeCode, associationsAssigned: associationsExist, associations: timesheet.employee.authorizeChargeAssociationModel }
  }

  public createLeaveModal(timesheet, currentDayHours, zeroHoursModel, hour, trackLeaveWithChargeCodes) {
    if (trackLeaveWithChargeCodes) {
      this.createTimeSheetModel(timesheet, currentDayHours, zeroHoursModel, hour, true)
    }
    else {
      this.storageService.getFromStorage('currentDate').then(res => {
        if (res != undefined) {
          let leaves = this.leavesFilter.filterLeavesOnCurrentDate(timesheet.employee.leaveModels, res);
          this.openLeavesModal({
            leaveModel: {
              'leaves': leaves,
              'timesheet': timesheet,
              'currentDate': res,
              'currentDayHours': currentDayHours,
              'zeroHoursModel': zeroHoursModel
            },
            editedChargeCode: {
              'id': hour ? hour.hourIds : "",
              "leave": hour ? hour.chargeCodes : "",
              "billable": hour ? hour.billable : false,
              "hour": hour ? hour.hour : "",
              "notes": hour ? hour.notes.length > 0 ? hour.notes.reverse()[0].note : "" : "",
              "isEditable": hour ? true : false,
            }
          })
        }
      })
    }
  }

  public isTimeSheetSubmitedWithEmployeeSignature(timesheet): boolean {
    let checkTimeSheetStatus = false;
    if (timesheet.timesheetStatus) {
      if (timesheet.timesheetStatus == "Unsubmitted" ||
        timesheet.timesheetStatus == "Approved w/o Employee Signature" ||
        timesheet.timesheetStatus == "Processing w/o Employee Signature" ||
        timesheet.timesheetStatus == "Rejected") {
        checkTimeSheetStatus = true;
      }
    }
    return checkTimeSheetStatus;
  }
  public isTimeSheetApproved(timesheet): boolean {
    let timeSheetStatus = false;
    if (timesheet.timesheetStatus) {
      if (timesheet.timesheetStatus == "Exported" ||
        timesheet.timesheetStatus == "Processed" ||
        timesheet.timesheetStatus == "Approved" ||
        timesheet.timesheetStatus == "Processing") {
        timeSheetStatus = true;
      }
    }
    return timeSheetStatus;
  }

  public isTimeSheetApprovedWithOutEmployeeSignature(timesheet): boolean {

    let timeSheetStatus = true;
    if (timesheet.timesheetStatus) {
      if (timesheet.timesheetStatus == "Approved w/o Employee Signature" ||
        timesheet.timesheetStatus == "Processing w/o Employee Signature" ||
        timesheet.timesheetStatus == "Submitted") {
        timeSheetStatus = false;
      }
      return timeSheetStatus
    }
  }

  public getStatusColor(timesheetModel): string {
    let status = "";
    if (timesheetModel.timesheetStatus == "Approved w/o Employee Signature" || timesheetModel.timesheetStatus == "Approved") {
      status = "limegreen";
    }
    if (timesheetModel.timesheetStatus == "Rejected") {
      status = "red";
    }
    if (timesheetModel.timesheetStatus == "Submitted") {
      status = "gold";
    }
    if (timesheetModel.timesheetStatus == "Processing w/o Employee Signature" || timesheetModel.timesheetStatus == "Exported" ||
      timesheetModel.timesheetStatus == "Processed" || timesheetModel.timesheetStatus == "Processing") {
      status = "darkgray"
    }
    return status;
  }

  presentSubmitioConfirm(check, timesheetModel, fun, domain : String) {
    let messagForSubmit = "You are submitting total " + parseFloat(timesheetModel.grandTotal).toFixed(2) + " hrs for " + timesheetModel.startDate + " - " + timesheetModel.endDate + "."
    let messagForUnSubmit = "You are unsubmitting time for " + timesheetModel.startDate + " - " + timesheetModel.endDate + "."
    let messageToBeDisplayed = check ? messagForSubmit : messagForUnSubmit;
    let actionButtonMessage = check ? "Submit" : "UnSubmit"
    let alert = this.alertCtrl.create({

      message: messageToBeDisplayed,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: actionButtonMessage,
          handler: () => {
            check ? this.submitTimeSheet(timesheetModel, fun, domain ) : this.unSubmitTimeSheet(timesheetModel, fun, domain);
          }
        }
      ]
    });
    alert.present();
  }

  public submitTimeSheet(timesheetModel, fun, domain : String) {
    this.csrxtokenService.checkAndUpdateCsrfToken().then(res => {
      if (res) {
        return this.communicationService.get(ENV.submitTimesheetUrl(domain, timesheetModel.id)).then((res: any) => {
          if (res && !res.errorIndicator) {
            fun.getTimesheet();
            this.toaster.showError("✓" + " " + " Timesheet successfully submitted.");
          }
        });
      }
    });
  }
  public unSubmitTimeSheet(timesheetModel, fun, domain : String) {
    this.csrxtokenService.checkAndUpdateCsrfToken().then(res => {
      if (res) {
        return this.communicationService.get(ENV.unSubmitTimesheetUrl(domain, timesheetModel.id)).then(res => {
          if(res && res === "OK" ){
            fun.getTimesheet();
          this.toaster.showError("✓" + " " + " Timesheet successfully unsubmitted.");
          }
        });
      }
    });

  }

}
