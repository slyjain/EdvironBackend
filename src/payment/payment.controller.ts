import { Controller, Post, Body, Get, Query ,Param} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { Types } from 'mongoose';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) { }

  @Post('create-request')
  async createPaymentRequest(
    @Body()
    body: {
      school_id: string;
      amount: number;
      months: number;
      callback_url: string;
      student_info: {
        id: string;
        name: string;
        email: string;
      };
    },
  ) {
    const { school_id, amount, months, callback_url, student_info } = body;
    console.log({ school_id, amount, months, callback_url, student_info });

    try {
      const paymentData = await this.paymentService.createPaymentRequest(
        school_id,
        amount,
        months,
        callback_url,
        student_info,
      );
      console.log("here");
      console.log(paymentData);
      return paymentData;
    } catch (err) {
      throw new Error(`Failed to create payment request: ${err.message}`);
    }
  }


  @Post('check-status')
  async checkStatus(
    @Body() body: { collect_request_id: string; school_id: string },
  ) {
    const { collect_request_id, school_id } = body;

    try {
      const result = await this.paymentService.checkPaymentStatus(
        collect_request_id,
        school_id,
      );
      return result;
    } catch (err) {
      throw new Error(`Failed to check payment status: ${err.message}`);
    }
  }

  @Get('callback')
  async listenCallback(
    @Query('EdvironCollectRequestId') collectRequestId: string,
    @Query('status') status: string,
  ) {
    // You can now update your DB, notify user, etc.
    console.log('Payment callback received:', { collectRequestId, status });

    // (Optional) Forward to service for further logic
    await this.paymentService.handleCallback(collectRequestId, status);

    // Return a simple response for confirmation
    return { message: 'Callback received', collectRequestId, status };
  }

  @Post('update_collect_req')
  async updateCollectRequest(
    @Body() body: { EdvironCollectRequestId: string; status: string; school_id: string },
  ) {
    const { EdvironCollectRequestId, status, school_id } = body;

    console.log('Update collect request:', { EdvironCollectRequestId, status, school_id });

    try {
      const transaction = await this.paymentService.findTransactionByCollectId(EdvironCollectRequestId);
      if (!transaction) throw new Error('Transaction not found');

      const verifyResponse = await this.paymentService.verifyPaymentStatus(EdvironCollectRequestId, school_id);
      console.log(transaction);
      await this.paymentService.updateTransactionStatus({
        collect_id: transaction._id as Types.ObjectId,
        order_amount: verifyResponse.amount,
        transaction_amount: verifyResponse.transaction_amount,
        payment_mode: verifyResponse.details.payment_mode,
        payment_details: verifyResponse.details,
        bank_reference: verifyResponse.details.bank_ref,
        payment_message: verifyResponse.capture_status,
        status: verifyResponse.status,
        error_message: verifyResponse.error || '',
        payment_time: new Date(),
      });

      return { message: 'Status updated successfully', EdvironCollectRequestId, status };
    } catch (err) {
      throw new Error(`Failed to update collect request: ${err.message}`);
    }
  }
  @Get('all-transactions')
  async getAllTransactions() {
    return await this.paymentService.fetchAllTransactions();
  }
  @Get('school/:schoolId')
  async getTransactionsBySchool(@Param('schoolId') schoolId: string) {
    return await this.paymentService.fetchTransactionsBySchool(schoolId);
  }
  @Get('transaction-status/:custom_order_id')
async getAndUpdateTransactionStatus(@Param('custom_order_id') customOrderId: string) {
  return this.paymentService.fetchAndUpdateTransactionStatus(customOrderId);
}

}

// {
//     "status": "NOT INITIATED",
//     "amount": 1,
//     "jwt": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdGF0dXMiOiJOT1QgSU5JVElBVEVEIiwiYW1vdW50IjoxfQ.Ne4THktqfg-R_78pJ_PBXjJ1tQUzV6DiRHaO5tQa5yE",
//     "sign": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdGF0dXMiOiJOT1QgSU5JVElBVEVEIiwiYW1vdW50IjoxLCJqd3QiOiJleUpoYkdjaU9pSklVekkxTmlJc0luUjVjQ0k2SWtwWFZDSjkuZXlKemRHRjBkWE1pT2lKT1QxUWdTVTVKVkVsQlZFVkVJaXdpWVcxdmRXNTBJam94ZlEuTmU0VEhrdHFmZy1SXzc4cEpfUEJYakoxdFFVelY2RGlSSGFPNXRRYTV5RSIsImV4cCI6MTc0NTkyMDU1NX0.p7FEYPyi13meNu8K2N9cwc2icuJiPHzdu5Apv9yIP0Q"
// }
