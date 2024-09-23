export class Session {
  id: string;
  accountId: string;
  refreshToken: string;
  token: string;
  ipAddress: string;
  userAgent: string;
  createdBy?: string;
  updatedBy?: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  deletedBy?: string;
}
