export class BankDto {
  id: string;
  swift: string;
  name: string;
  acct_length: number;
  country_id: string;
  created_at: Date;
  updated_at: Date;
}
export class BankResponse {
  message: string;
  data: [BankDto];
}
