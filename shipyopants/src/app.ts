import {
    APIGatewayProxyEvent,
    APIGatewayProxyResult
} from "aws-lambda";

import * as AWS from "aws-sdk"




import axios, { AxiosInstance, AxiosResponse } from 'axios';
import Taxjar from "taxjar";
import { TaxParams } from "taxjar/dist/types/paramTypes";
import { AddressDTO, IncomingTaxRequest, TaxResponse } from "./taxDTOS";

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
    const taxRequest = JSON.parse(event.body);
    console.log(taxRequest);


    const toAddress: AddressDTO = {
        city: taxRequest.toAddress.city,
        state: taxRequest.toAddress.state,
        zipCode: taxRequest.toAddress.zipCode,
        street: taxRequest.toAddress.street,
        country: taxRequest.toAddress.country
    }
    const fromAddress: AddressDTO = {
        city: taxRequest.fromAddress.city,
        state: taxRequest.fromAddress.state,
        zipCode: taxRequest.fromAddress.zipCode,
        street: taxRequest.fromAddress.street,
        country: taxRequest.fromAddress.country
    }
    const incTaxRequest: IncomingTaxRequest = {
        toAddress: toAddress,
        fromAddres: fromAddress,
        subtotal: taxRequest.subtotal,
        shippingCost: taxRequest.shippingCost
    }
    
    const taxJarKey: string = await getParameterFromSSM('TAX_JAR_API_KEY_SB', true);

    const taxJarClient = new Taxjar({
        apiKey: taxJarKey
    });

    const taxParams: TaxParams = {
        from_country: incTaxRequest.fromAddres.country,
        from_zip: incTaxRequest.fromAddres.zipCode,
        from_state: incTaxRequest.fromAddres.state,
        from_city: incTaxRequest.fromAddres.city,
        from_street: incTaxRequest.fromAddres.street,
        to_country: incTaxRequest.toAddress.country,
        to_zip: incTaxRequest.toAddress.zipCode,
        to_state: incTaxRequest.toAddress.state,
        to_city: incTaxRequest.toAddress.city,
        to_street: incTaxRequest.toAddress.street,
        amount: incTaxRequest.subtotal,
        shipping: incTaxRequest.shippingCost,
      };


    const result = await taxJarClient.taxForOrder(taxParams);
    const response: TaxResponse = {
        amountToCollect: result.tax.amount_to_collect,
        rate: result.tax.rate
    }

    return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(response)
    }
}