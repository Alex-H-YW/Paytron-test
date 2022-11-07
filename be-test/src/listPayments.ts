import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { buildResponse } from './lib/apigateway';
import { listPayments } from './lib/payments';

export const handler = async (event:APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const currency = event?.pathParameters?.currency;
    const payments = await listPayments()
    if (currency) {
        try {
            const filteredPayments = payments.filter((payment) => payment.currency === currency);
            return buildResponse(200, { data: filteredPayments });
        } catch (error) {
            return buildResponse(400, "something error");
      }
    }else {
        try {
          return buildResponse(200, { data: payments });
        } catch (error) {
          return buildResponse(400, "something error");
        }
      }
    
};
