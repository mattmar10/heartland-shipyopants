import {
    APIGatewayProxyEvent,
    APIGatewayProxyResult
} from "aws-lambda";

export const lambdaHandler = async (
    event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
    const queries = JSON.stringify(event.queryStringParameters);

    //do stuff here
    console.log('ahahahahahaha');

    return {
        statusCode: 401,
        body: `Queries: ${queries}`
    }
}