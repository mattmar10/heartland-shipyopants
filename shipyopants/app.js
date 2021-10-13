"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lambdaHandler = void 0;
const axios_1 = require("axios");
const lambdaHandler = async (event) => {
    const queries = JSON.stringify(event.queryStringParameters);
    //do stuff here
    console.log('taco salad');
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