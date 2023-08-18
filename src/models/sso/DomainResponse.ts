export class DomainResponse {
    public validCompany!: boolean;
    public ssoEnabled!: String;
    private isValid: boolean = true;

    constructor(domainResponse: any) {
        if (domainResponse !== false && domainResponse !== undefined) {
            this.validCompany = domainResponse.validCompany;
            this.ssoEnabled = domainResponse.ssoEnabled;
        }
        else
            this.isValid = false;
    }

    public isValidDomain() : boolean {
        return this.isValid &&  this.validCompany;
    }

}