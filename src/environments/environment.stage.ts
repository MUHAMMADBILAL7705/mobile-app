export const ENV = {
  mode: 'Production',
  production: false,

  getCompanyUrl: function (domain:string): string {
    return 'https://' + domain + '.stage.hourtimesheet.com/company';
  },
  saveHoursWorkedUrl: function (domain:string): string {
    return 'https://' + domain + '.stage.hourtimesheet.com/hoursWorked/v1';
  },
  updateEmployeeTrackLocation: function (domain:string) {
    return 'https://' + domain + '.stage.hourtimesheet.com/employee/track/data';
  },
  deleteHoursWorkedUrl: function (domain:string): string {
    return 'https://' + domain + '.stage.hourtimesheet.com/hoursWorked/deleteone';
  },
  loginUrl: function (domain:string): string {
    return 'https://' + domain + '.stage.hourtimesheet.com/login/mobile-app';
  },
  resetPasswordUrl: function (domain:string, email:string): string {
    return 'https://' + domain + '.stage.hourtimesheet.com/employees/' + email + '/reset-password';
  },
  domainCheckUrl: function (domain:string): string {
    return 'https://' + domain +'.stage.hourtimesheet.com/login/domaincheck/' + domain;
  },
  savePunchUrl: function (domain:string): string {
    return 'https://' + domain + '.stage.hourtimesheet.com/punches';
  },
  getTimesheetConfigurationUrl: function (domain:string): string {
    return 'https://' + domain + '.stage.hourtimesheet.com/timesheetConfiguration';
  },
  getTimesheetUrl: function (domain:string, selectedDay:string): string {
    return 'https://' + domain + '.stage.hourtimesheet.com/timesheet/' + selectedDay;
  },
  getInitialResponce: function (domain:string): string {
    return 'https://' + domain  + '.stage.hourtimesheet.com/app/init/' + domain;
  },
  sSOInitialUrl: function (domain:string): string {
    return 'https://' + domain + '.stage.hourtimesheet.com/mobile/sso/init';
  },
  sSOLogoutUrl: function (domain:string): string {
    return 'https://' + domain + '.stage.hourtimesheet.com/mobile/sso/logout';
  },
  sSOFinishUrl: function (domain:string): string {
    return 'https://' + domain + '.stage.hourtimesheet.com/mobile/sso/finish';
  },
  submitTimesheetUrl: function (domain:string, timesheetId:string): string {
    return 'https://' + domain + '.stage.hourtimesheet.com/timesheet/sign/' + timesheetId;
  },
  unSubmitTimesheetUrl: function (domain:string, timesheetId:string): string {
    return 'https://' + domain + '.stage.hourtimesheet.com/timesheet/unsign/' + timesheetId;
  },
  leaveBalanceURL: function (domain:string): string {
    return 'https://' + domain + '.stage.hourtimesheet.com/employee/leave-balances';
  },
  addleaveRequestURL: function (domain:string, employeeId:string): string {
    return 'https://' + domain + '.stage.hourtimesheet.com/employees/' + employeeId + '/leave-request';
  },
  getLeaveRequestsByEmployeeURL: function (domain:string, employeeId:string): string {
    return 'https://' + domain + '.stage.hourtimesheet.com/employees/' + employeeId + '/leave-requests';
  },
  cancelLeaveRequestByEmployeeURL: function (domain:string, employeeId:string, leaveRequestId:string): string {
    return 'https://' + domain + '.stage.hourtimesheet.com/employees/' + employeeId + '/leave-requests/' + leaveRequestId + '/cancel';
  },
  getCompanyFeature: function (domain:string): string {
    return `https://jfrtn48c45.execute-api.us-west-2.amazonaws.com/stage/feature?companyName=${domain}`;
  }
}
