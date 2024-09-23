export class Faq {
  id: string;
  title: string;
  description: string;
  tags: string[];
  // coverImage?: FileDto;
  archiveReason: string;
  createdBy?: string;
  updatedBy?: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  deletedBy?: string;
}
