"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.lambdaHandler = void 0;
const AWS = __importStar(require("aws-sdk"));
const axios_1 = __importDefault(require("axios"));
const taxjar_1 = __importDefault(require("taxjar"));
const getParameterFromSSM = async (name, decrypt) => {
    const ssm = new AWS.SSM({ region: 'us-east-1' });
    const result = await ssm
        .getParameter({ Name: name, WithDecryption: decrypt })
        .promise();
    return result.Parameter.Value;
};
const lambdaHandler = async (event) => {
    const queries = JSON.stringify(event.queryStringParameters);
    const taxJarKey = await getParameterFromSSM('TAX_JAR_API_KEY_SB', true);
    const taxJarClient = new taxjar_1.default({
        apiKey: taxJarKey
    });
    //do stuff here
    console.log(`tax jar ${taxJarKey}`);
    const result = await axios_1.default.get('https://swapi.dev/api/planets/1');
    console.log(JSON.stringify(result.data));
    console.log(event.httpMethod);
    const taxParams = {
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
    };
};
exports.lambdaHandler = lambdaHandler;
//# sourceMappingURL=app.js.map