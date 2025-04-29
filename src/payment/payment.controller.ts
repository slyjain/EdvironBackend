import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { PaymentService } from './payment.service';

@Controller('payment')
export class PaymentController {
    constructor(private readonly paymentService: PaymentService) { }

    @Post('create-request')
    async createPaymentRequest(
        @Body() body: { school_id: string; amount: number; months: number },
    ) {
        const { school_id, amount, months } = body;

        // Define the callback URL on the backend
        const callbackUrl = 'http://localhost:3000/payment/callback'; // Replace with your actual callback URL

        try {
            // Call the payment service to create the payment request
            const paymentData = await this.paymentService.createPaymentRequest(
                school_id,
                amount,
                months,
                callbackUrl, // Pass the callback URL from backend
            );

            return paymentData; // This will return the response data from the payment service
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
}
// {
//     "status": "NOT INITIATED",
//     "amount": 1,
//     "jwt": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdGF0dXMiOiJOT1QgSU5JVElBVEVEIiwiYW1vdW50IjoxfQ.Ne4THktqfg-R_78pJ_PBXjJ1tQUzV6DiRHaO5tQa5yE",
//     "sign": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdGF0dXMiOiJOT1QgSU5JVElBVEVEIiwiYW1vdW50IjoxLCJqd3QiOiJleUpoYkdjaU9pSklVekkxTmlJc0luUjVjQ0k2SWtwWFZDSjkuZXlKemRHRjBkWE1pT2lKT1QxUWdTVTVKVkVsQlZFVkVJaXdpWVcxdmRXNTBJam94ZlEuTmU0VEhrdHFmZy1SXzc4cEpfUEJYakoxdFFVelY2RGlSSGFPNXRRYTV5RSIsImV4cCI6MTc0NTkyMDU1NX0.p7FEYPyi13meNu8K2N9cwc2icuJiPHzdu5Apv9yIP0Q"
// }
