import { Injectable, Type } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import axios from "axios"
import { Types, Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Transaction } from './transaction.entity';
import { TransactionStatus } from './transaction-status.entity';
import { WebhookLogsService } from '../webhook-logs/webhook-logs.service';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class PaymentService {
  private readonly secretKey: string;
  private readonly apikey: string;
  constructor(
    private configService: ConfigService,
    private readonly webhookLogsService: WebhookLogsService,
    @InjectModel(Transaction.name)
    private readonly transactionModel: Model<Transaction>,

    @InjectModel(TransactionStatus.name)
    private readonly transactionStatusModel: Model<TransactionStatus>,
  ) {
    
    this.secretKey = this.configService.get<string>('pg_key')!;
    this.apikey = this.configService.get<string>('API_KEY')!;
  }
  async createPaymentRequest(
    school_id: string,
    amount: number,
    months: number,
    callback_url: string,
    student_info: { id: string; name: string; email: string },
  ) {
    const payload = {
      school_id: school_id,
      amount: amount.toString(),
      callback_url: callback_url,
    };
    // console.log(payload)
    const sign = jwt.sign(payload, this.secretKey);

    try {
      const response = await axios.post(
        'https://dev-vanilla.edviron.com/erp/create-collect-request',
        {
          school_id: school_id,
          amount: amount,
          callback_url: callback_url,
          sign: sign,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.apikey}`,
          },
        },
      );
      

      const { collect_request_id, collect_request_url } = response.data;
      await this.webhookLogsService.createLog({
        collect_request_id: collect_request_id,
        school_id: school_id,
        payload: response.data,
      });
      // console.log(response.data);
     
      await this.transactionModel.create({
        school_id: new Types.ObjectId(school_id),
        student_info: {
          name: student_info.name,
          id: student_info.id,
          email: student_info.email,
        },
        collect_request_id: collect_request_id,
      });


      return { collect_request_id, collect_request_url };
    } catch (err) {
      throw new Error(`Payment request failed: ${err.message}`);
    }
  }

  async checkPaymentStatus(collect_request_id: string, school_id: string) {
    const payload = {
      school_id,
      collect_request_id,
    };

    const sign = jwt.sign(payload, this.secretKey);

    const url = `https://dev-vanilla.edviron.com/erp/collect-request/${collect_request_id}?school_id=${school_id}&sign=${sign}`;

    try {
      const response = await axios.get(url, {
        headers: {
          'Authorization': `Bearer ${this.apikey}`,
        },
      });
      await this.webhookLogsService.createLog({
        collect_request_id: collect_request_id,
        school_id: school_id,
        payload: response.data,
      });

      // console.log("Response data :", response.data);
      return response.data;
    } catch (err) {
      throw new Error(`Payment status fetch failed: ${err.response?.data?.message || err.message}`);
    }
  }

  async handleCallback(collectRequestId: string, status: string) {
    
    // console.log(`Updating order ${collectRequestId} with status: ${status}`);
  }

  async createTransaction(data: {
    school_id: string;
    trustee_id: string;
    student_info: { name: string; id: string; email: string };
    collect_request_id: string;
  }) {
    return this.transactionModel.create(data);
  }

  async updateTransactionStatus(data: {
    collect_id: Types.ObjectId;
    order_amount: number;
    transaction_amount: number;
    payment_mode: string;
    payment_details: any;
    bank_reference: string;
    payment_message: string;
    status: string;
    error_message: string;
    payment_time: Date;
  }) {
    return this.transactionStatusModel.create({
      ...data,
      payment_details: JSON.stringify(data.payment_details),
    });
  }

  async fetchTransactionsByStudent(studentId: string) {
    return await this.transactionStatusModel.aggregate([
      {
        $lookup: {
          from: 'transactions',
          localField: 'collect_id',
          foreignField: '_id',  
          as: 'transaction',
        },
      },
      {
        $unwind: '$transaction', 
      },
      {
        $match: {
          'transaction.student_info.id': studentId, 
        },
      },
      {
        $project: {
          amount: '$transaction_amount',  
          status: 1,  
          payment_time: 1,  
        },
      },
      {
        $sort: {
          payment_time: -1, 
        },
      },
    ]);
  }
  
  
  
  async verifyPaymentStatus(collect_request_id: string, school_id: string) {
    try {
      const status = await this.checkPaymentStatus(collect_request_id, school_id);
      // console.log("Verified payment status:", status);
      return status;
    } catch (err) {
      throw new Error(`Failed to verify payment status: ${err.message}`);
    }
  }


  async findTransactionByCollectId(collect_request_id: string) {
    return this.transactionModel.findOne({ collect_request_id }).exec();
  }


  async findTransactionById(transactionId: string | Types.ObjectId) {
    return this.transactionModel.findById(transactionId).exec();
  }
  async fetchAllTransactions(
    page = 1,
    limit = 10,
    sort = 'payment_time',
    order: 'asc' | 'desc' = 'desc'
  ) {
    const skip = (page - 1) * limit;
  
    const sortDirection = order === 'asc' ? 1 : -1;
  
    return this.transactionStatusModel.aggregate([
      {
        $lookup: {
          from: 'transactions',
          localField: 'collect_id',
          foreignField: '_id',
          as: 'transaction',
        },
      },
      { $unwind: '$transaction' },
      {
        $project: {
          collect_id: 1,
          school_id: '$transaction.school_id',
          gateway: '$payment_mode',
          order_amount: 1,
          transaction_amount: 1,
          status: 1,
          custom_order_id: '$transaction.collect_request_id',
          payment_time: 1,
        },
      },
      { $sort: { [sort]: sortDirection } },
      { $skip: skip },
      { $limit: limit },
    ]);
  }
  
  // payment.service.ts
  async fetchTransactionsBySchool(schoolId: string) {
    return await this.transactionStatusModel.aggregate([
      {
        $lookup: {
          from: 'transactions',
          localField: 'collect_id',
          foreignField: '_id',
          as: 'transaction',
        },
      },
      { $unwind: '$transaction' },
      {
        $match: {
          'transaction.school_id': new Types.ObjectId(schoolId),
        },
      },
      {
        $project: {
          collect_id: 1,
          school_id: '$transaction.school_id',
          gateway: '$payment_mode',
          order_amount: 1,
          transaction_amount: 1,
          status: 1,
          custom_order_id: '$transaction.collect_request_id',
          payment_time:1,
        },
      },
    ]);
  }
  async fetchAndUpdateTransactionStatus(customOrderId: string) {
    // console.log(customOrderId);

    const transaction = await this.transactionModel.findOne({ collect_request_id: customOrderId });
    // console.log(transaction);

    if (!transaction) {
      throw new Error('Transaction not found');
    }

    const { _id: collect_id, school_id } = transaction;

    const payload = {
      school_id: school_id.toString(),
      collect_request_id: customOrderId,
    };
    // console.log(payload);

    const sign = jwt.sign(payload, this.secretKey); // JWT-based signing

    const url = `https://dev-vanilla.edviron.com/erp/collect-request/${customOrderId}?school_id=${school_id}&sign=${sign}`;

    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${this.apikey}`,
        },
      });
      await this.webhookLogsService.createLog({
        collect_request_id: customOrderId,
        school_id: school_id,
        payload: response.data,
      });
      const data = response.data;
      // console.log("response data:", data);

      const paymentTime = new Date(data.payment_time);
      const isValidDate = !isNaN(paymentTime.getTime()) ? paymentTime : null;  // Check if date is valid

      const updatePayload = {
        order_amount: data.order_amount,
        transaction_amount: data.transaction_amount,
        payment_mode: data.payment_mode,
        payment_details: data.payment_details,
        bank_reference: data.bank_reference,
        payment_message: data.payment_message,
        status: data.status,
        error_message: data.error_message || null,
        payment_time: isValidDate,  // Set valid date or null
      };

      // console.log(updatePayload);

      
      const updatedTransactionStatus = await this.transactionStatusModel.findOneAndUpdate(
        { collect_id: collect_id as Types.ObjectId },  
        {
          collect_id: collect_id as Types.ObjectId, 
          ...updatePayload, 
          payment_details: JSON.stringify(data.payment_details),
        },
        { upsert: true, new: true }  
      );

      return updatedTransactionStatus;
    } catch (err) {
      throw new Error(`Failed to fetch or update transaction status: ${err.response?.data?.message || err.message}`);
    }
  }

}
