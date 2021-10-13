import {
    APIGatewayProxyEvent,
    APIGatewayProxyResult
} from "aws-lambda";

import * as AWS from "aws-sdk"




import axios, { AxiosInstance, AxiosResponse } from 'axios';

const getParameterFromSSM = async (name: string, decrypt: boolean): Promise<string> => {
    const ssm = new AWS.SSM({ region: 'us-east-1' });
    const result = await ssm
        .getParameter({ Name: name, WithDecryption: decrypt })
        .promise();
    return result.Parameter.Value;
}


export const lambdaHandler = async (
    event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
    const queries = JSON.stringify(event.queryStringParameters);


    const taxJarKey: string = await getParameterFromSSM('TAX_JAR_API_KEY_SB', true);

    //do stuff here
    console.log(`tax jar ${taxJarKey}`);
    const result = await axios.get('https://swapi.dev/api/planets/1');
    console.log(JSON.stringify(result.data))

    console.log(event.httpMethod);

    return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(result.data)
    }
}