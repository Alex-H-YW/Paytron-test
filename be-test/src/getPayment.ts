import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { getPayment } from './lib/payments';
import { buildResponse } from './lib/apigateway';

export const handler = async (event:APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const id = event.pathParameters?.id;
    try {
        if(id){
            const payment = await getPayment(id)
            if(payment) {
                return buildResponse(200, payment);
            } 
        } 
        return buildResponse(404, "no match ID");
    } catch (e) {
        return buildResponse(500, "something error");
    }
};
