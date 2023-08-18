import { GlobalProvider } from './../../global/global';
import { Injectable } from '@angular/core';
import { empty } from 'rxjs/Observer';
import { DateTimeUtils } from "../../util/date-time-utils/date-time-utils";
import { CustomUtils } from "../../util/custom-utils/custom-utils";
import { SortingUtilsProvider } from "../../util/sorting-utils/sorting-utils";
import * as moment from 'moment';
import { PayTypeModel } from '../../../models/payType/PayTypeModel';

@Injectable()
export class ChargeCodeTransformer {
  constructor(public dateTimeUtils: DateTimeUtils, public customUtils: CustomUtils, public sortingUtils: SortingUtilsProvider, private global: GlobalProvider) {
  }

  public filterAssociations(associations: any): any {
    let filteredAssociations = [];
    associations.forEach(association => {
      if (this.isAvailable(association, this.global.currentDay)) {
        filteredAssociations.push(association)
      }
    });
    return filteredAssociations;
  }

  public transformToModel(chargeCodes, payTypes): any {
    let chargeCodeModels = [];
    if (chargeCodes != null) {
      chargeCodes.forEach(chargeCodeModel => {
        let model = { chargeCodeName: chargeCodeModel.codesType, chargeCodes: [], order: chargeCodeModel.order };
        if (chargeCodeModel.codesType != "Job") {
          model.chargeCodes = chargeCodeModel.chargeCodes;
        }
        chargeCodeModels.push(model);
      })
    }
    this.addPayType(payTypes, chargeCodeModels);
    return this.getSortedChargeCodeHeadesAndChargeCodes(chargeCodeModels);
  }

  public transformChargeCodesToModel(chargeCodes): any {
    let chargeCodeModels = [];
    if (chargeCodes != null) {
      chargeCodes.forEach(chargeCodeModel => {
        let oldIndex = chargeCodeModels.length > 0 ? this.getTypeIndex(chargeCodeModel, chargeCodeModels) : null;
        let oldChargeCode = oldIndex != null ? this.getOldChargeCode(chargeCodeModel, chargeCodeModels[oldIndex].chargeCodes) : null;
        let model;
        if (oldChargeCode == null) {
          chargeCodeModel.hierarchicalName = chargeCodeModel.hierarchicalName != null ? chargeCodeModel.hierarchicalName.replace(new RegExp(":", "g"), " > ") : "";
          if (oldIndex == null) {
            model = { type: chargeCodeModel.chargeCodeName, chargeCodes: [chargeCodeModel] };
            chargeCodeModels.push(model);
          }
          if (oldIndex != null) {
            chargeCodeModels[oldIndex].chargeCodes.push(chargeCodeModel);
          }
        }
      })
    }
    return chargeCodeModels;
  }

  public transform(associations, currentDate): any {
    let chargeCodes = new Map<string, any>();
    let filteredAssociations = [];
    associations.forEach(association => {
      if (this.isAvailable(association, currentDate)) {
        this.addChargeCodeTypes(association, chargeCodes);
        filteredAssociations.push(association)
      }
    });
    return this.addRespectiveChargecodeToType(filteredAssociations, chargeCodes, empty);
  }

  public addRespectiveChargecodeToType(associations, chargeCodes, chargeCodeOrderMap): any {
    associations.forEach(association => {
      this.addRespectivePayTypes(association, chargeCodes);
      association.chargeCodes.filter((obj1, index) => {
        chargeCodes.forEach((chargeCode, index) => {
          if (obj1.chargeCodeName == index) {
            chargeCode.length > 0 ?
              this.checkDuplication(this.getObjectNamesOnIndex(chargeCodes, index), obj1, chargeCodes, index) :
              chargeCodes.get(obj1.chargeCodeName).push(Object.assign([], obj1));
          }
        });
      });
    });
    let codes = [];
    chargeCodes.forEach((key, value) => codes.push({
      chargeCodeName: value, chargeCodes: key, order: this.setOrder(value, key, chargeCodeOrderMap, chargeCodes)
    }));
    codes = this.getSortedChargeCodeHeadesAndChargeCodes(codes)
    return codes;
  }

  public resetChargeCodeLists(list: any, selectedChargeCode, isSelectedChargeCodeList: boolean) {
    list.forEach((chargeCode, index) => {
      if (chargeCode.chargeCodeName != selectedChargeCode.chargeCodeName && selectedChargeCode.order < chargeCode.order) {
        isSelectedChargeCodeList ? list.set(index, []) : chargeCode.chargeCodes = [];
      }
      if (chargeCode.chargeCodeName == "Pay Type") {
        isSelectedChargeCodeList ? list.set("Pay Type", []) : chargeCode.chargeCodes = [];
      };

    });
  }

  public resetSelectedList(list: any, selectedChargeCode) {
    list.forEach((chargeCode, index) => {
      if (index != selectedChargeCode.chargeCodeName && selectedChargeCode.order < chargeCode.order) {
        list.set(index, [])
      }
      if (index == "Pay Type") {
        list.set("Pay Type", [])
      };

    });
  }


  public reduceMasterChargeCodesArrayTypeObjectToMap(masterChargeCode) {
    let tempMap = new Map<string, any>();
    masterChargeCode.forEach(obj => {
      tempMap.set(obj.chargeCodeName, obj.chargeCodes);
    });
    masterChargeCode = tempMap;
    return masterChargeCode;
  }

  public filterSelectedAssosiations(selectedAssociationList, selectedChargeCode) {
    let tempList = [];
    let tempChargeCodeNames;
    let tempSelectedChargeCode;
    selectedAssociationList.forEach(association => {
      tempSelectedChargeCode = this.getObjectNames(selectedChargeCode);
      tempChargeCodeNames = this.getObjectNames(association.chargeCodes);
      if (tempSelectedChargeCode.every(r => tempChargeCodeNames.includes(r))) {
        tempList.push(association)
      }
    })
    return tempList;
  }

  public setSelectedChargeCodeList(selectedChargeCodelist, editableChargeCodes, leaves) {
    editableChargeCodes.forEach(element => {
      if (element.id) {
        selectedChargeCodelist.set("Pay Type", element);
      }
      else if (element.type == 'Leave') {
        selectedChargeCodelist.set("Pay Type", this.getPayTypeFromLeave(element, leaves));
      }
      else {
        selectedChargeCodelist.set(element.type, element);
      }
    });
    return selectedChargeCodelist;
  }
  private getPayTypeFromLeave(element, leaves) {
    let filteredLeave = leaves.filter(leave => leave.id == element.chargeCodeId)[0];
    return new PayTypeModel(filteredLeave);
  }

  private getObjectNames(objectToBeSearched): Array<string> {
    let temp = [];
    if (objectToBeSearched) {
      objectToBeSearched.forEach(obj => {
        if (!this.customUtils.isObjectEmpty(obj) && obj.id !== "") {
          temp.push(obj.id);
        }
      });
    }
    return temp;
  }

  private getObjectNamesOnIndex(chargeCodes, index): Array<string> {
    let temp = [];
    if (chargeCodes.get(index)) {
      if (chargeCodes.get(index).length > 0) {
        let tempPayType = chargeCodes.get(index);
        tempPayType.forEach(obj => {
          temp.push(obj.name);
        });
      }
    }
    return temp;
  }

  private setOrder(value, key, chargeCodeOrderMap, chargeCodes) {

    if (key.length > 0) {
      return key[0].order;
    }
    else if (value == "Job") {
      return chargeCodes.get("Customer")[0].order + 1;
    }
    else {
      return chargeCodeOrderMap.get(value);
    }
  }

  private getSortedChargeCodeHeadesAndChargeCodes(codes) {

    codes = this.customUtils.sortHeaders(codes);
    codes.forEach(chargeCode => {
      chargeCode.chargeCodes.sort(this.sortingUtils.SortArrayObjectsByPropAlphaNum("name"));
    })
    return codes;
  }

  private addRespectivePayTypes(association, chargeCodes): any {
    try {
      var temp: any = [];
      temp = this.getObjectNamesOnIndex(chargeCodes, "Pay Type");
      if (association.payTypeModel != null) {
        temp.length > 0 ? this.checkDuplication(temp, association.payTypeModel, chargeCodes, "Pay Type") : chargeCodes.get("Pay Type").push(this.duplicate(association.payTypeModel));
      }
    }
    catch (e) {
      throw new Error("No charge codes are assigned to you. Please contact your administrator");
    }
  }

  private checkDuplication(listToBeCompared, objectToBeAdded, chargeCodes, index): any {
    if (listToBeCompared.includes(objectToBeAdded.name) == false) {
      chargeCodes.get(index).push(this.duplicate(objectToBeAdded))
    }
  }



  private isAvailable(association: any, currentDate): boolean {
    return this.dateTimeUtils.isBetweenDates(currentDate, association.startDate, association.endDate)
      || moment(currentDate).format('YYYY-MM-DD') == moment(association.startDate).format('YYYY-MM-DD')
      || moment(currentDate).format('YYYY-MM-DD') == moment(association.endDate).format('YYYY-MM-DD');
  }

  private duplicate(value: any): any {
    return Object.assign([], value);
  }

  private addChargeCodeTypes(association, chargeCodes) {
    association.chargeCodes.forEach(chargeCode => {
      if (chargeCodes.get(chargeCode.chargeCodeName) == null) {
        chargeCodes.set(chargeCode.chargeCodeName, []);
      }
    })
    if (association.payTypeModel != null && chargeCodes.get(association.payTypeModel) == null) {
      chargeCodes.set("Pay Type", []);
    }
  }

  private addPayType(payTypes, chargeCodes) {
    if (payTypes != null && payTypes.length > 0) {
      chargeCodes.push({ chargeCodeName: "Pay Type", chargeCodes: payTypes });
    }
  }

  private getOldChargeCode(chargeCode, chargeCodes): any {
    return chargeCodes.filter(oldChargeCode => oldChargeCode.id == chargeCode.id)[0];
  }

  private getTypeIndex(chargeCode, chargeCodes): number {
    let index: number;
    chargeCodes.forEach((charge, i) => {
      if (charge != null && charge.type == chargeCode.chargeCodeName)
        index = i;
    })
    return index;
  }

}
