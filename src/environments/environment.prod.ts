export const ENV = {
  mode: 'Production',
  production: true,

  getCompanyUrl: function (domain:string): string {
    return 'https://' + domain + '.hourtimesheet.com/company';
  },
  saveHoursWorkedUrl: function (domain:string): string {
    return 'https://' + domain + '.hourtimesheet.com/hoursWorked/v1';
  },

  deleteHoursWorkedUrl: function (domain:string): string {
    return 'https://' + domain + '.hourtimesheet.com/hoursWorked/deleteone';
  },
  loginUrl: function (domain:string): string {
    return 'https://' + domain + '.hourtimesheet.com/login/mobile-app';
  },
  resetPasswordUrl: function (domain:string, email:string): string {
    return 'https://' + domain + '.hourtimesheet.com/employees/' + email + '/reset-password';
  },
  domainCheckUrl: function (domain:string): string {
    return 'https://clickchaininc.hourtimesheet.com/login/domaincheck/' + domain;
  },
  updateEmployeeTrackLocation: function (domain:string) {
    return 'https://' + domain + '.hourtimesheet.com/employee/track/data';
  },
  getInitialResponce: function (domain:string): string {
    return 'https://' + domain  + '.hourtimesheet.com/app/init/' + domain;
  },
  sSOInitialUrl: function (domain:string): string {
    return 'https://' + domain + '.hourtimesheet.com/mobile/sso/init';
  },
  sSOLogoutUrl: function (domain:string): string {
    return 'https://' + domain + '.hourtimesheet.com/mobile/sso/logout';
  },
  sSOFinishUrl: function (domain:string): string {
    return 'https://' + domain + '.hourtimesheet.com/mobile/sso/finish';
  },
  savePunchUrl: function (domain:string): string {
    return 'https://' + domain + '.hourtimesheet.com/punches';
  },
  getTimesheetConfigurationUrl: function (domain:string): string {
    return 'https://' + domain + '.hourtimesheet.com/timesheetConfiguration';
  },
  getTimesheetUrl: function (domain:string, selectedDay:string): string {
    return 'https://' + domain + '.hourtimesheet.com/timesheet/' + selectedDay;
  },
  submitTimesheetUrl: function (domain:string, timesheetId:string): string {
    return 'https://' + domain + '.hourtimesheet.com/timesheet/sign/' + timesheetId;
  },
  unSubmitTimesheetUrl: function (domain:string, timesheetId:string): string {
    return 'https://' + domain + '.hourtimesheet.com/timesheet/unsign/' + timesheetId;
  },
  leaveBalanceURL: function (domain:string): string {
    return 'https://' + domain + '.hourtimesheet.com/employee/leave-balances';
  },
  addleaveRequestURL: function (domain:string, employeeId:string): string {
    return 'https://' + domain + '.hourtimesheet.com/employees/' + employeeId + '/leave-request';
  },
  getLeaveRequestsByEmployeeURL: function (domain:string, employeeId:string): string {
    return 'https://' + domain + '.hourtimesheet.com/employees/' + employeeId + '/leave-requests';
  },
  cancelLeaveRequestByEmployeeURL: function (domain:string, employeeId:string, leaveRequestId:string): string {
    return 'https://' + domain + '.hourtimesheet.com/employees/' + employeeId + '/leave-requests/' + leaveRequestId + '/cancel';
  },
  getCompanyFeature: function (domain:string): string {
    return `https://s6l86fva63.execute-api.us-west-2.amazonaws.com/prod/feature?companyName=${domain}`;
  }
}
