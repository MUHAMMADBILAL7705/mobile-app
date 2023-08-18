export const ENV = {
  mode: 'Development',
  production: false,

  getCompanyUrl: function (domain:string): string {
    return '/company';
  },
  saveHoursWorkedUrl: function (domain:string): string {
    return '/hoursWorked/v1';
  },

  deleteHoursWorkedUrl: function (domain:string): string {
    return '/hoursWorked/deleteone';
  },
  loginUrl: function (domain:string): string {
    return '/login/mobile-app';
  },
  domainCheckUrl: function (domain:string): string {
    return '/login/domaincheck/' + domain;
  },
  updateEmployeeTrackLocation: function (domain:string): string {
    return '/employee/track/data';
  },
  resetPasswordUrl: function (domain:string, email:string): string {
    return '/employees/' + email + '/reset-password';
  },
  savePunchUrl: function (domain:string): string {
    return '/punches';
  },
  getInitialResponce: function (domain:string): string {
    return '/app/init/' + domain;
  },
  sSOInitialUrl: function (domain:string): string {
    return '/mobile/sso/init';
  },
  sSOLogoutUrl: function (domain:string): string {
    return '/mobile/sso/logout';
  },
  sSOFinishUrl: function (domain:string): string {
    return '/mobile/sso/finish';
  },
  getTimesheetConfigurationUrl: function (domain:string): string {
    return '/timesheetConfiguration';
  },
  getTimesheetUrl: function (domain:string, selectedDay:string): string {
    return '/timesheet/' + selectedDay;
  },
  submitTimesheetUrl: function (domain:string, timesheetId:string): string {
    return '/timesheet/sign/' + timesheetId;
  },
  unSubmitTimesheetUrl: function (domain:string, timesheetId:string): string {
    return '/timesheet/unsign/' + timesheetId;
  },
  leaveBalanceURL: function (domain:string): string {
    return '/leave-balances';
  },
  addleaveRequestURL: function (domain:string, employeeId:string): string {
    return '/employees/' + employeeId + '/leave-request';
  },
  getLeaveRequestsByEmployeeURL: function (domain:string, employeeId:string): string {
    return '/employees/' + employeeId + '/leave-requests';
  },
  cancelLeaveRequestByEmployeeURL: function (domain:string, employeeId:string, leaveRequestId:string): string {
    return '/employees/' + employeeId + '/leave-requests/' + leaveRequestId + '/cancel';
  },
  getCompanyFeature: function (domain:string): string {
  return `https://jfrtn48c45.execute-api.us-west-2.amazonaws.com/stage/feature?companyName=${domain}`;
  }
}
