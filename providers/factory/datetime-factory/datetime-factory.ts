import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class DatetimeFactory {

  constructor(public http: HttpClient) {
    console.log('Hello DatetimeFactoryProvider Provider');
  }

}
