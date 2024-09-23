import { Account } from '@account/domains/accounts/account';
import { AccountEntity } from '@account/persistence/accounts/account.entity';
import { Address } from '@libs/common/address';
import { FileDto } from '@libs/common/file-dto';
import { ApiProperty } from '@nestjs/swagger';

export class AccountResponse {
  @ApiProperty()
  id: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  phoneNumber: string;
  @ApiProperty()
  email: string;
  @ApiProperty()
  type: string;
  @ApiProperty()
  isActive: boolean;
  @ApiProperty()
  gender?: string;
  @ApiProperty()
  address?: Address;
  @ApiProperty()
  profileImage?: FileDto;
  @ApiProperty()
  planTypeId: string;
  @ApiProperty()
  planTypeDuration: number;
  // @ApiProperty()
  // numberOfJobPosts: number;
  // @ApiProperty()
  // numberOfRequests: number;
  @ApiProperty()
  verified: boolean;
  @ApiProperty()
  notifyMe: boolean;
  @ApiProperty()
  isPaid: boolean;
  @ApiProperty()
  fcmId?: string;
  @ApiProperty()
  createdBy?: string;
  @ApiProperty()
  updatedBy?: string;
  @ApiProperty()
  createdAt: Date;
  @ApiProperty()
  updatedAt: Date;
  @ApiProperty()
  deletedAt?: Date;
  @ApiProperty()
  deletedBy?: string;
  @ApiProperty()
  isOnline: boolean;

  numberOfUnseenChats: number;
  latestMessage: string;
  latestSender: string;
  latestMessageDate: Date;
  kids: string[];
  static fromEntity(accountEntity: AccountEntity): AccountResponse {
    const accountResponse = new AccountResponse();
    accountResponse.id = accountEntity.id;
    accountResponse.name = accountEntity.name;
    accountResponse.email = accountEntity.email;
    accountResponse.phoneNumber = accountEntity.phoneNumber;
    accountResponse.type = accountEntity.type;
    accountResponse.isActive = accountEntity.isActive;
    accountResponse.gender = accountEntity.gender;
    accountResponse.address = accountEntity.address;
    accountResponse.profileImage = accountEntity.profileImage;
    accountResponse.planTypeId = accountEntity.planTypeId;
    accountResponse.planTypeDuration = accountEntity.planTypeDuration;
    // accountResponse.numberOfJobPosts = accountEntity.numberOfJobPosts;
    // accountResponse.numberOfRequests = accountEntity.numberOfRequests;
    accountResponse.verified = accountEntity.verified;
    accountResponse.notifyMe = accountEntity.notifyMe;
    accountResponse.isPaid = accountEntity.isPaid;
    accountResponse.isOnline = accountEntity.isOnline;
    accountResponse.fcmId = accountEntity.fcmId;
    accountResponse.createdBy = accountEntity.createdBy;
    accountResponse.updatedBy = accountEntity.updatedBy;
    accountResponse.deletedBy = accountEntity.deletedBy;
    accountResponse.createdAt = accountEntity.createdAt;
    accountResponse.updatedAt = accountEntity.updatedAt;
    accountResponse.deletedAt = accountEntity.deletedAt;

    return accountResponse;
  }
  static fromDomain(account: Account): AccountResponse {
    const accountResponse = new AccountResponse();
    accountResponse.id = account.id;
    accountResponse.name = account.name;
    accountResponse.email = account.email;
    accountResponse.phoneNumber = account.phoneNumber;
    accountResponse.type = account.type;
    accountResponse.isActive = account.isActive;
    accountResponse.gender = account.gender;
    accountResponse.address = account.address;
    accountResponse.profileImage = account.profileImage;
    // accountResponse.numberOfJobPosts = account.numberOfJobPosts;
    // accountResponse.numberOfRequests = account.numberOfRequests;
    accountResponse.planTypeId = account.planTypeId;
    accountResponse.planTypeDuration = account.planTypeDuration;
    accountResponse.verified = account.verified;
    accountResponse.notifyMe = account.notifyMe;
    accountResponse.isPaid = account.isPaid;
    accountResponse.isOnline = account.isOnline;
    accountResponse.fcmId = account.fcmId;
    accountResponse.createdBy = account.createdBy;
    accountResponse.updatedBy = account.updatedBy;
    accountResponse.deletedBy = account.deletedBy;
    accountResponse.createdAt = account.createdAt;
    accountResponse.updatedAt = account.updatedAt;
    accountResponse.deletedAt = account.deletedAt;
    // if (account.paymentPlan) {
    //   accountResponse.paymentPlan = PaymentPlanResponse.fromEntity(
    //     account.paymentPlan,
    //   );
    // }
    return accountResponse;
  }
}
