import { Injectable } from '@angular/core';
import * as moment from 'moment';
import * as momentTimezone from 'moment-timezone';
import { StorageService } from "../../service/storage-service/storage-service";


@Injectable()
export class DateTimeUtils {

  private timeZone : string;

  constructor(private storageService: StorageService) {
    this.setTimeZone();
  }

  public isBetweenDates(dateToFind, start, end): boolean {
    var result: boolean;
    const date = momentTimezone.tz(dateToFind, this.timeZone);
    const startDate = moment(start);
    const endDate = moment(end);

    if(end == ""){
      result = moment(date).isAfter(startDate);
    }else{
      result = moment(date).isBetween(startDate, endDate);
    }
    return result;
  }

  private setTimeZone(){
    this.storageService.getFromStorage('companyData').then(res => {
      if(res != undefined){
        this.timeZone = res.timeZone;
      }
     });
  }
}