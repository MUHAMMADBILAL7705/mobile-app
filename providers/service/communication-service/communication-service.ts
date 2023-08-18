import { Injectable } from '@angular/core';
import { GlobalProvider } from "../../global/global";
import 'rxjs/add/operator/map';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { StorageService } from '../storage-service/storage-service';
import {ENV} from "@app/env";
import * as moment from 'moment-timezone';


@Injectable()
export class CommunicationService {

  constructor(private http: HttpClient, private global: GlobalProvider,
    private storageService: StorageService) {
  }

  public async getCompanyFeatures():Promise<any>{
    let companyData=await this.storageService.getFromStorage("appData");
    if (companyData==null || companyData.loginData==null || companyData.loginData.domain==null) return false;
    let url = ENV.getCompanyFeature(companyData.loginData.domain);
    return new Promise(resolve => {
      this.http.get(url).subscribe(responseData=>{
        resolve(responseData);
      },error => {
        resolve(false);
      })
    });
  }

  public post(url: string, data?: any): Promise<any> {
    return new Promise(resolve => {
      this.getCsrfToken()
        .then(token => {
          this.http.post(url, JSON.stringify(data), this.createHeaders(token))
            .subscribe(responseData => {
              resolve(responseData);
            }, (error) => {
              resolve(false)
            })
        })
    });
  }

  public delete(url: string): Promise<any> {
    return new Promise(resolve => {
      this.getCsrfToken()
        .then(token => {
          this.http.delete(url, this.createHeaders(token))
            .subscribe(responseData => {
              resolve(responseData);
            }, (error) => {
              resolve(false)
            })
        });
    });
  }

  public get(url: string, data?: any) {
    return new Promise(resolve => {
      this.getCsrfToken()
        .then(token => {
          this.http.get(url, this.formateData(data, token))
            .subscribe(data => {
              let responseData = data;
              resolve(responseData);
            }, (error) => {
              resolve(false)
            })
        });
    });
  }

  public getdomain(url: string): Observable<Boolean> {
    const headersToSend = new HttpHeaders().append('Content-Type', 'application/json')
    .append('Access-Control-Allow-Origin', '*');
    return this.http.get<Boolean>(url, {headers: headersToSend});
  }

  public getResetPasswwordLink(url: string) {
    return this.http.post(url, { observe: "response" });
  }

  private formateData(data: any, token: any): any {
    const headersToSend = new HttpHeaders();
    headersToSend.set('Content-Type', 'application/json');
    headersToSend.set('Access-Control-Allow-Origin', '*');
    headersToSend.set('X-XSRF-TOKEN', token);
    return { headers: headersToSend, params: data };
  }

  private createHeaders(token): any {
    let headersToSend = new HttpHeaders();
    headersToSend = headersToSend.append('Content-Type', 'application/json')
      .append('Access-Control-Allow-Origin', '*').append('X-XSRF-TOKEN', token ? token : '').append('timezone', this.getTimeZone());
    return { withCredentials: true, headers: headersToSend };
  }

  private getCsrfToken(): Promise<any> {
    return new Promise(resolve => {
      this.storageService.getFromStorage('tokenData')
        .then(tokenData =>{
          console.log("Token data before any call", tokenData)
           resolve(tokenData != null ? tokenData.token : "")
          })
    });
  }

  private getTimeZone(): any{
    var date = moment(new Date()).format("MM/DD/YYYY HH:mm Z");
    var timezoneValue =  date.slice(date.length-7,date.length);
    var splitedTimezone = timezoneValue.split(":");
    return splitedTimezone[0]+ splitedTimezone[1];
  }
}
