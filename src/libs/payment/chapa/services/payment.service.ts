import { CustomerDto } from './../dtos/customer.dto';
import { AcceptPaymentResponse } from './../dtos/payment.dto';
import { Injectable } from '@nestjs/common';
import { BankResponse } from '../dtos/bank.dto';
import axios, { AxiosInstance } from 'axios';

@Injectable()
export class PaymentService {
  private readonly apiSecretKey = process.env.CHAPA_SECRET_KEY;
  private axiosInstance: AxiosInstance;
  constructor() {
    this.axiosInstance = axios.create({
      baseURL: `${process.env.CHAPA_BASEURL}`,
      timeout: 10000,
      headers: {
        Authorization: `Bearer ${this.apiSecretKey}`,
        'Content-Type': 'application/json',
      },
    });
  }
  async getBanks(): Promise<BankResponse> {
    const banks = await this.axiosInstance.get<BankResponse>('/banks');
    return banks.data;
  }
  async initializePayment(
    //  customerInfo: CustomerDto,
    paymentInfo: any,
  ): Promise<AcceptPaymentResponse> {
    const response = await this.axiosInstance.post<AcceptPaymentResponse>(
      '/transaction/initialize',
      paymentInfo,
    );
    return response.data;
  }
  async verifyPayment(transactionReference: string) {
    const response = await this.axiosInstance.get<any>(
      `/transaction/verify/${transactionReference}`,
    );

    return response.data;
  }
}
