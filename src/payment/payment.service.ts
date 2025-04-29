import { Injectable} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import axios from "axios"

@Injectable()
export class PaymentService {
    private readonly secretKey = 'edvtest01'; // Replace with your actual secret key
    private readonly apikey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0cnVzdGVlSWQiOiI2NWIwZTU1MmRkMzE5NTBhOWI0MWM1YmEiLCJJbmRleE9mQXBpS2V5Ijo2LCJpYXQiOjE3MTE2MjIyNzAsImV4cCI6MTc0MzE3OTg3MH0.Rye77Dp59GGxwCmwWekJHRj6edXWJnff9finjMhxKuw"
    async createPaymentRequest(schoolId: string, amount: number, months: number, callbackUrl: string) {
        const payload = {
            school_id: schoolId,
            amount: amount.toString(),
            callback_url: callbackUrl,
        };

        // Generate JWT token
        const sign = jwt.sign(payload, this.secretKey);
        console.log(sign);

        try {
            // Call the payment gateway API (replace URL and headers as per your setup)
            const response = await axios.post(
                'https://dev-vanilla.edviron.com/erp/create-collect-request', // Replace with actual API endpoint
                {
                    school_id: schoolId,
                    amount: amount.toString(),
                    callback_url: callbackUrl,
                    sign: sign,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${this.apikey}`,
                    },
                },
            );

            return response.data; // Return the response from the payment API (this could include the payment URL)
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
      
      
}
