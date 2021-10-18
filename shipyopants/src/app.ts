import {
    APIGatewayProxyEvent,
    APIGatewayProxyResult
} from "aws-lambda";

import * as AWS from "aws-sdk"




import axios, { AxiosInstance, AxiosResponse } from 'axios';
import Taxjar from "taxjar";
import { TaxParams } from "taxjar/dist/types/paramTypes";

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
    //need to add tax key to new AWS SSM
    const taxJarKey: string = await getParameterFromSSM('TAX_JAR_API_KEY_SB', true);

    const taxJarClient = new Taxjar({
        apiKey: taxJarKey
    });

    //do stuff here
    console.log(`tax jar ${taxJarKey}`);
    const result = await axios.get('https://swapi.dev/api/planets/1');
    console.log(JSON.stringify(result.data));

    console.log(event.httpMethod);

    const taxParams: TaxParams = {
        from_country: 'US',
        from_zip: '07001',
        from_state: 'NJ',
        from_city: 'Avenel',
        from_street: '305 W Village Dr',
        to_country: 'US',
        to_zip: '73116',
        to_state: 'OK',
        to_city: 'Oklahoma City',
        to_street: '2600 Somerset Pl',
        amount: 16.50,
        shipping: 1.5,
      };


    taxJarClient
        .taxForOrder(taxParams)
        .then(res => {
            console.log(res.tax);
            console.log(res.tax.amount_to_collect);
        });

    return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(result.data)
    }
}