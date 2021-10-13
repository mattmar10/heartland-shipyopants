import {
    APIGatewayProxyEvent,
    APIGatewayProxyResult
} from "aws-lambda";


import axios, { AxiosInstance, AxiosResponse } from 'axios';


export const lambdaHandler = async (
    event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
    const queries = JSON.stringify(event.queryStringParameters);

    //do stuff here
    console.log('taco salad');
    const result = await axios.get('https://swapi.dev/api/planets/1');
    console.log(JSON.stringify(result.data))

    console.log(event.httpMethod);

    return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(result.data)
    }
}