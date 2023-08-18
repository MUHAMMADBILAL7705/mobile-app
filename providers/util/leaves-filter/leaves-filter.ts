import { Injectable } from '@angular/core';
import { DateTimeUtils } from "../../util/date-time-utils/date-time-utils";
import * as moment from 'moment';
import { SortingUtilsProvider } from "../../util/sorting-utils/sorting-utils";


@Injectable()
export class LeavesFilter {


  constructor(public dateTimeUtils:DateTimeUtils, public sortingutils:SortingUtilsProvider) {

  }
  public filterLeavesOnCurrentDate(leavesModel,currentDate){
    let filteredLeaves=[];
    let formatedDate= moment(currentDate).format('YYYY-MM-DD')
    if(leavesModel.length>0){
      leavesModel.forEach(leave => {
        if(this.isAvailable(leave,formatedDate)){
          filteredLeaves.push(leave);
        }
      });
    }
    filteredLeaves.sort(this.sortingutils.SortArrayObjectsByPropAlphaNum("name"));
  return filteredLeaves;
  }

  private isAvailable(leave: any, currentDate): boolean {
    return this.dateTimeUtils.isBetweenDates(currentDate, leave.startDate, leave.endDate) || currentDate==moment(leave.startDate).format('YYYY-MM-DD')|| currentDate==moment(leave.endDate).format('YYYY-MM-DD');
  }




}
