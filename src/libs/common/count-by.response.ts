import { ApiProperty } from '@nestjs/swagger';

export class CountByCreatedAtResponse {
  @ApiProperty()
  createdAt: string;
  @ApiProperty()
  count: number;
}
export class CountByServiceAndCreatedAtResponse {
  @ApiProperty()
  employmentType: string;
  @ApiProperty()
  createdAt: string;
  @ApiProperty()
  count: number;
}
export class CountByCreatedAtAndIsCompanyResponse {
  @ApiProperty()
  createdAt: string;
  @ApiProperty()
  isCompany: string;
  @ApiProperty()
  count: number;
}
export class CountByCreatedAtAndEmploymentTypeResponse {
  @ApiProperty()
  createdAt: string;
  // @ApiProperty()
  // employmentType: string;
  @ApiProperty()
  count: number;
}
export class CountEarningByCreatedAtResponse {
  @ApiProperty()
  createdAt: string;
  @ApiProperty()
  total: number;
}
export class CountByCreatedAtStatusResponse {
  @ApiProperty()
  createdAt: string;
  @ApiProperty()
  status: string;
  @ApiProperty()
  count: number;
}
export class CountByStatusResponse {
  @ApiProperty()
  status: string;
  @ApiProperty()
  count: number;
}
export class GroupByResignationReasonResponse {
  @ApiProperty()
  reason: string;
  @ApiProperty()
  count: number;
}
export class CountByTypeResponse {
  @ApiProperty()
  type: string;
  @ApiProperty()
  count: number;
}
export class CountByCategoryResponse {
  @ApiProperty()
  category: string;
  @ApiProperty()
  count: number;
}
export class CountByGenderResponse {
  @ApiProperty()
  gender: string;
  @ApiProperty()
  count: number;
}
export class CountByViewsResponse {
  @ApiProperty()
  routeId: string;
  @ApiProperty()
  views: number;
}
export class GroupByAddressResponse {
  @ApiProperty()
  address: string;
  @ApiProperty()
  count: number;
}
export class GroupByRatingResponse {
  @ApiProperty()
  rating: string;
  @ApiProperty()
  count: number;
}
export class GroupByTypeAndRatingResponse {
  @ApiProperty()
  employmentType: string;
  @ApiProperty()
  rating: string;
  @ApiProperty()
  count: number;
}
export class GroupByCategoryResponse {
  @ApiProperty()
  category: string;
  @ApiProperty()
  count: number;
}
export class GroupByServiceResponse {
  @ApiProperty()
  employmentType: string;
  @ApiProperty()
  status: string;
  @ApiProperty()
  count: number;
}
export class GroupByHiredCategoryResponse {
  @ApiProperty()
  category: string;
  @ApiProperty()
  status: string;
  @ApiProperty()
  hiredcount: number;
  @ApiProperty()
  candidateCount: number;
}
export class TransactionTotalResponse {
  @ApiProperty()
  total: number;
}
export class GroupByTypeResponse {
  @ApiProperty()
  type: string;
  @ApiProperty()
  count: number;
}