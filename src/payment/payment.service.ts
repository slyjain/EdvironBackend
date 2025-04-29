import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import axios from "axios"
import { Types, Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Transaction } from './transaction.entity';
import { TransactionStatus } from './transaction-status.entity'; // Adjust the path as needed

@Injectable()
export class PaymentService {
  constructor(
    @InjectModel(Transaction.name)
    private readonly transactionModel: Model<Transaction>,

    @InjectModel(TransactionStatus.name)
    private readonly transactionStatusModel: Model<TransactionStatus>,
  ) { }

  private readonly secretKey = 'edvtest01'; // Replace with your actual secret key
  private readonly apikey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0cnVzdGVlSWQiOiI2NWIwZTU1MmRkMzE5NTBhOWI0MWM1YmEiLCJJbmRleE9mQXBpS2V5Ijo2LCJpYXQiOjE3MTE2MjIyNzAsImV4cCI6MTc0MzE3OTg3MH0.Rye77Dp59GGxwCmwWekJHRj6edXWJnff9finjMhxKuw"

  async createPaymentRequest(
    school_id: string,
    amount: number,
    months: number,
    callback_url: string,
    student_info: { id: string; name: string; email: string },
  )  {
    const payload = {
      school_id: school_id,
      amount: amount.toString(),
      callback_url: callback_url,
    };
    console.log(payload)
    const sign = jwt.sign(payload, this.secretKey);
  
    try {
      const response = await axios.post(
        'https://dev-vanilla.edviron.com/erp/create-collect-request',
        {
          school_id: school_id,
          amount:amount,
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
      console.log(response.data);
      // Save transaction to your DB
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

      return response.data;
    } catch (err) {
      throw new Error(`Payment status fetch failed: ${err.response?.data?.message || err.message}`);
    }
  }

  async handleCallback(collectRequestId: string, status: string) {
    // You can write to DB, update order status, etc.
    console.log(`Updating order ${collectRequestId} with status: ${status}`);
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

  // ✅ NEW: Verify payment status via external API and return parsed data
  async verifyPaymentStatus(collect_request_id: string, school_id: string) {
    try {
      const status = await this.checkPaymentStatus(collect_request_id, school_id);
      console.log("Verified payment status:", status);
      return status;
    } catch (err) {
      throw new Error(`Failed to verify payment status: ${err.message}`);
    }
  }

  // ✅ NEW: Find transaction by collect_request_id
  async findTransactionByCollectId(collect_request_id: string) {
    return this.transactionModel.findOne({ collect_request_id }).exec();
  }

  // ✅ NEW: Find transaction by MongoDB _id
  async findTransactionById(transactionId: string | Types.ObjectId) {
    return this.transactionModel.findById(transactionId).exec();
  }
}
