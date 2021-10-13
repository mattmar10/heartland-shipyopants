"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lambdaHandler = void 0;
const AWS = require("aws-sdk");
const axios_1 = require("axios");
const getParameterWorker = async (name, decrypt) => {
    const ssm = new AWS.SSM({ region: 'us-east-1' });
    const result = await ssm
        .getParameter({ Name: name, WithDecryption: decrypt })
        .promise();
    return result.Parameter.Value;
};
const lambdaHandler = async (event) => {
    const queries = JSON.stringify(event.queryStringParameters);
    const taxJarKey = await getParameterWorker('TAX_JAR_API_KEY_SB', true);
    //do stuff here
    console.log(`tax jar ${taxJarKey}`);
    const result = await axios_1.default.get('https://swapi.dev/api/planets/1');
    console.log(JSON.stringify(result.data));
    console.log(event.httpMethod);
    return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(result.data)
    };
};
exports.lambdaHandler = lambdaHandler;
//# sourceMappingURL=app.js.map