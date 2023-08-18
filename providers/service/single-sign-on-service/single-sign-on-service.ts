import { Injectable } from '@angular/core';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { CommunicationService } from "../communication-service/communication-service";
import { ENV } from '@app/env';


@Injectable()
export class SingleSignOnService {
    constructor(private iab: InAppBrowser, private communicationService: CommunicationService) {
    }

    public loginViaSSO(domainName: string): Promise<any> {
        return new Promise(resolve => {
            this.getCallBackUrl(domainName)
                .then(url => {
                    this.finishUrl(this.createFinishSSOModel(url), domainName)
                        .then(res => {
                            resolve(res);
                        })
                })
        })
    }

    public logoutViaSSO(domainName: string) {
        this.getLogoutUrl(domainName)
            .then(res => {
                const browser = this.iab.create(res.sSOUrl, "_blank", { location: 'no', hideurlbar: "yes" });
                browser.on('loadstop').subscribe((e) => {
                    if (this.isValidLogoutUrl(e.url))
                        browser.close();
                });
            }, (error) => {
                console.log(error)
            });
    }

    private getCallBackUrl(domainName: string): Promise<string> {
        return new Promise(resolve => {
            this.getInitialUrl(domainName)
                .then(
                    res => {
                        if (res) {
                            const browser = this.iab.create(res.sSOUrl, "_blank", { location: 'no', hideurlbar: "yes" });
                            browser.on('loadstart').subscribe((e) => {
                                if (this.isValidUrl(e.url)) {
                                    resolve(this.isValidUrl(e.url) ? e.url : "");
                                    browser.close();
                                }
                            });
                        }
                    }, (error) => {
                        console.log(error)
                    }
                );
        })
    }

    private isValidUrl(url: string): boolean {
        return url.includes("app/sso/finish?code=");
    }

    private isValidLogoutUrl(url: string): boolean {
        return url.includes("common/oauth2/v2.0/logoutsession");
    }

    private getInitialUrl(domain): Promise<any> {
        return this.communicationService.get(ENV.sSOInitialUrl(domain));
    }

    private getLogoutUrl(domain): Promise<any> {
        return this.communicationService.get(ENV.sSOLogoutUrl(domain));
    }

    private finishUrl(sSOFinishModel, domain: string): Promise<any> {
        return this.communicationService.post(ENV.sSOFinishUrl(domain), sSOFinishModel);
    }

    public createFinishSSOModel(url: string) {
        return {
            code: this.isValidUrl(url) ? url.split("code=")[1].split("&state=")[0] : "",
            state: this.isValidUrl(url) ? url.split("code=")[1].split("&state=")[1].split("&session_state")[0] : ""
        };
    };
}
