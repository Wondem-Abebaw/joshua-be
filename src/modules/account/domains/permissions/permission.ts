export class Permission {
  id: string;
  name: string;
  key: string;
  createdBy?: string;
  updatedBy?: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
  deletedBy: string;
  archiveReason: string;
}
