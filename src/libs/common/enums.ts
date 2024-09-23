export enum StartTime {
  Auto = 'now',
  NextMonth = 'nextMonth',
  NextYear = 'nextYear',
  HaveNotDecided = 'haveNotDecided',
}
export enum Gender {
  Male = 'male',
  Female = 'female',
}
export enum EmployeeGender {
  // Male = 'male',
  Female = 'female',
}
export enum ContactMethod {
  Phone = 'phone',
  Telegram = 'telegram',
  SMS = 'sms',
  InPerson = 'inPerson',
}
// export enum StudentAssignmentStatus {
// New = 'new',
// WaitingToBeAssigned = 'waitingToBeAssigned',
// ContractSigned = 'contractSigned',
// Disagreed = 'disagreed',
// Assigned = 'assigned',
// }
export enum CredentialType {
  Employee = 'employee',
  Employer = 'employer',
  Agent = 'agent',
  Tutor = 'tutor',
  Parent = 'parent',
  Kid = 'kid',
  School = 'school',
  Teacher = 'teacher',
}
export enum PaymentMethod {
  Manual = 'Tutor',
  Telebirr = 'Telebirr',
  Chapa = 'Chapa',
  Bank = 'Bank',
  InternetBanking = 'Internet Banking',
  WalletTransfer = 'Wallet Transfer',
  BookingWithdraw = 'Booking Withdraw',
  CommissionWithdraw = 'Commission Withdraw',
  WalletTransferToEmployee = 'Wallet Transfer To Employee',
  WalletTransferFromCorporate = 'Wallet Transfer from Corporate',
  RefundFromEmployee = 'RefundFromEmployee',
}
export enum PaymentStatus {
  Pending = '1',
  Success = '2',
  Timeout = '3',
  Cancelled = '4',
  Failed = '5',
  Error = '-1',
}
export enum ChapaPaymentStatus {
  Pending = 'pending',
  Success = 'success',
  Timeout = 'timeout',
  Cancelled = 'cancelled',
  Failed = 'failed',
  Error = 'error',
}
export enum WalletType {
  IndividualWallet = 'IndividualWallet',
  CorporateWallet = 'CorporateWallet',
}

export enum DateOfWeek {
  MONDAY = 'Mon',
  TUESDAY = 'Tue',
  WEDNESDAY = 'Wed',
  THURSDAY = 'Thu',
  FRIDAY = 'Fri',
  SATURDAY = 'Sat',
  SUNDAY = 'Sun',
}
export enum NotificationMethod {
  Notification = 'notification',
  Sms = 'sms',
  Both = 'both',
}
export enum ChapaSplitType {
  Percentage = 'percentage',
  Flat = 'flat',
}
export enum EmployeeStatus {
  Pending = 'Pending',
  Active = 'Active',
  InActive = 'InActive',
  OnDuty = 'OnDuty',
  LeftJob = 'LeftJob',
}
export enum PlanTypeDuration {
  Free = 0,
  Monthly = 30,
  ThreeMonths = 90,
  SixMonths = 180,
  Yearly = 365,
}

export enum PlanType {
  Free = 'Free',
  Silver = 'Silver',
  Gold = 'Gold',
  Premiuim = 'Premiuim',
}
export enum JobPostType {
  Free = '1',
  Silver = '50',
  Gold = '100',
  Premiuim = '100',
}
export enum RequestType {
  Free = '1',
  Silver = '50',
  Gold = '100',
  Premiuim = '100',
}
export enum JobStatus {
  Open = 'Open',
  Close = 'Close',
  Assigned = 'Assigned',
}
export enum CandidateStatus {
  Active = 'Active',
  Inactive = 'Inactive',
  Hired = 'Hired',
  PendingApproval = 'PendingApproval',
}
export enum HiredStatus {
  Pending = 'Pending',
  Accepted = 'Accepted',
  Rejected = 'Rejected',
  LeftJob = 'LeftJob',
  Cancelled = 'Cancelled',
}
export enum LeaveStatus {
  Pending = 'Pending',
  Accepted = 'Accepted',
  Rejected = 'Rejected',
}
export enum NotificationTypes {
  System = 'System',
  Request = 'Request',
  Job = 'Job',
  Hired = 'Hired',
  Payment = 'Payment',
  LeaveRejected = 'LeaveRejected',
  Chat = 'Chat',
  Logout = 'Logout',
}
export enum AdvertSections {
  HomeTop = 'Home Top',
  HomeMiddle = 'Home Middle',
  StatusTop = 'Status Top',
}
export enum EmployerExportType {
  Potential = 'Potential',
  Engaged = 'Engaged',
  TurnOver = 'Turnover',
}
export enum ParentStatus {
  New = 'New',
  Active = 'Active',
  InActive = 'InActive',
}
export enum RoomStatus {
  Closed = 'Closed',
  Open = 'Open',
}
export enum AttendanceStatus {
  Present = 'Present',
  Absent = 'Absent',
  Late = 'Late',
  Excused = 'Excused',
}
