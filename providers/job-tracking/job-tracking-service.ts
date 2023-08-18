import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ChargeCodeTransformer } from "../transformer/charge-code-transformer/charge-code-transformer";
import { CustomUtils } from "../util/custom-utils/custom-utils";

/*
  Generated class for the JobTrackingProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class JobTrackingService {
  private associations: any = [];
  private chargeCodeAndOrderMap: any;

  constructor(
    public http: HttpClient,
    public chargeCodeTransformer: ChargeCodeTransformer,
    private customUtils: CustomUtils
  ) {}

  public getDefaultSelectedChargeCodesModel(allChargeCodeList): any {
    let defaultSelectedModel = [];
    allChargeCodeList.forEach((element, index) => {
      defaultSelectedModel.push({
        name: "",
        id: "",
        chargeCodeName: element.chargeCodeName,
        order: index + 1
      });
    });
    return defaultSelectedModel;
  }

  public sortChargeCodesOnTheBasisOfOrder(allChargeCodes){
   this.customUtils.sortHeadersOnTheBasisOfOrderKey(allChargeCodes);
  }

  public updateChargeCodeList(
    selectedChargeCode: any,
    allChargeCodes: any,
    masterChargeCodeList: any,
    selectedChargeCodesList: any,
    associations: any,
    selectedChargeCodeIndex: number
  ): any {
    this.getMapOfOrdersAndChargeCodeType(masterChargeCodeList);
    this.deselectNextChargeCodesInSelectedChargeCodesList(
      selectedChargeCodesList,
      selectedChargeCodeIndex
    );
    let relatedAssociations = this.getRelatedAssoiciationCopy(
      associations,
      selectedChargeCode,
      selectedChargeCodesList
    );
    if (relatedAssociations.length) {
      this.associations = relatedAssociations;
    }
    let filteredAssociations = this.chargeCodeTransformer.filterSelectedAssosiations(
      this.associations,
      selectedChargeCodesList
    );
    this.updateMasterList(
      filteredAssociations,
      masterChargeCodeList,
      selectedChargeCode
    );
    this.updateAllChargeCodesList(
      allChargeCodes,
      masterChargeCodeList,
      selectedChargeCodeIndex
    );
    console.log(masterChargeCodeList);
  }

  private deselectNextChargeCodesInSelectedChargeCodesList(
    selectedCharges,
    currentIndex
  ) {
    selectedCharges.forEach((selectedCode, index) => {
      if (index > currentIndex) {
        selectedCharges[index] = Object.assign(
          {},
          {
            name: "",
            id: "",
            chargeCodeName: selectedCode.chargeCodeName,
            order: index + 1
          }
        );
      }
    });
  }

  private updateAllChargeCodesList(
    allChargeCodeList,
    masterChargeCodeList,
    selectedChargeCodeIndex
  ) {
    masterChargeCodeList.forEach((codes, index) => {
      if (index > selectedChargeCodeIndex) {
        if(codes.chargeCodeName == 'Job'){
          this.updateJobHeirarichalName(codes);
        }
        allChargeCodeList[index].chargeCodes = this.customUtils.deepCopyArrayObejct(codes.chargeCodes);
      }
    });
  }

  private updateJobHeirarichalName (jobs){
    jobs.chargeCodes.forEach(job =>{
      job.hierarchicalName = this.customUtils.replaceString(job.hierarchicalName,":",">");
    })
  }

  private updateMasterList(
    assoociationList,
    masterChargeCodeList,
    selectedChargeCode
  ): void {
    this.chargeCodeTransformer.resetChargeCodeLists(
      masterChargeCodeList,
      selectedChargeCode,
      false
    );
    masterChargeCodeList = this.chargeCodeTransformer.reduceMasterChargeCodesArrayTypeObjectToMap(
      masterChargeCodeList
    );
    masterChargeCodeList = this.chargeCodeTransformer.addRespectiveChargecodeToType(
      assoociationList,
      masterChargeCodeList,
      this.chargeCodeAndOrderMap
    );
  }

  private getMapOfOrdersAndChargeCodeType(masterCodes) {
    let tempOrder = new Map<string, any>();
    masterCodes.forEach(obj => {
      tempOrder.set(obj.chargeCodeName, obj.order);
    });
    this.chargeCodeAndOrderMap = tempOrder;
  }

  public resetJobsWithoutAssociation(
    selectedChargeCode,
    masterChargeCodeList,
    allChargeCodeList,
    currentIndex,
    selectedChargeCodes
  ) {
    selectedChargeCodes[currentIndex + 1] = Object.assign(
      {},
      {
        name: "",
        id: "",
        chargeCodeName: selectedChargeCodes[currentIndex + 1].chargeCodeName,
        order: selectedChargeCodes[currentIndex + 1].order
      }
    );
    this.resetChargeCodeOfJobs(selectedChargeCode, masterChargeCodeList);
    this.updateAllChargeCodesList(
      allChargeCodeList,
      masterChargeCodeList,
      currentIndex
    );
  }

  private resetChargeCodeOfJobs(selectedChargeCode, masterChargeCodeList) {
    let jobList = [];
    if (!this.customUtils.isObjectEmpty(selectedChargeCode)) {
      this.getSelectedChargeCodeChilds(selectedChargeCode, jobList);
    }
    masterChargeCodeList.forEach(obj => {
      if (obj.chargeCodeName == "Job") {
        obj.chargeCodes = [];
        obj.chargeCodes = Object.assign([], jobList);
      }
    });
  }

  private getSelectedChargeCodeChilds(selectedChargeCode, jobChildrenList) {
    selectedChargeCode.children.forEach(obj => {
      if (!obj.children) {
        jobChildrenList.push(obj);
      } else {
        if (obj.children.length > 0) {
          this.getSelectedChargeCodeChilds(obj, jobChildrenList);
        } else {
          obj.hierarchicalName = this.customUtils.replaceString(obj.hierarchicalName,":",">");
          jobChildrenList.push(obj);
        }
      }
    });
    return jobChildrenList;
  }

  private isValidPayType(masterChargeCodeList, selectedChargeCodes): boolean {
    let valid: boolean = true;
    if (
      masterChargeCodeList[masterChargeCodeList.length - 1].chargeCodeName ==
        "Pay Type" &&
      selectedChargeCodes[selectedChargeCodes.length - 1].id == ""
    ) {
      valid = false;
      throw new Error("Pay Type is required");
    }
    return valid;
  }

  private isValidJob(selectedChargeCodes): boolean {
    let valid: boolean = true;
    if (
      selectedChargeCodes[0].children &&
      selectedChargeCodes[0].children.length &&
      selectedChargeCodes[1].chargeCodeName == "Job" &&
      (selectedChargeCodes[1].id == "" || selectedChargeCodes[1].id == "null")
    ) {
      valid = false;
      throw new Error("Job is required");
    }
    return valid;
  }

  private hasValidChargeCodeSelectionWithPayType(masterChargeCodeList, selectedChargeCodes): boolean {
    let valid: boolean = true;
    if (
      masterChargeCodeList[masterChargeCodeList.length - 1].chargeCodeName ==
        "Pay Type" &&
      selectedChargeCodes[selectedChargeCodes.length - 1].id != ""
      && !this.anyChargeSelected(selectedChargeCodes)
    ) {
      valid = false;
      throw new Error("Select at least one charge code");
    }
    return valid;
  }

  private anyChargeSelected(selectedCharge){
    let selectedChargeCopy = this.customUtils.deepCopyArrayObejct(selectedCharge);
    selectedChargeCopy.pop();
    return selectedChargeCopy.filter(charge=>{
      return charge.id != "" && charge.id != "null"
    }).length != 0
  }

  public validateSelectedChargeCodes(masterChargeCodeList,selectedChargeCode):boolean {
   return (this.isValidJob(selectedChargeCode) && this.isValidPayType(masterChargeCodeList, selectedChargeCode) && this.hasValidChargeCodeSelectionWithPayType(masterChargeCodeList, selectedChargeCode))
  }

  public getRelatedAssoiciationCopy(associationCopy, selectedChargeCode, selectedChargeList) {
    let temp = [];

    associationCopy.map(association => {
      association.chargeCodes.map((chargeCode, index) => {
        if (index == 0 && chargeCode.name == selectedChargeCode.name && chargeCode.chargeCodeName == selectedChargeCode.chargeCodeName) {
            temp.push(Object.assign([], association));
        }
      });
    });
    return temp;
  }
}
