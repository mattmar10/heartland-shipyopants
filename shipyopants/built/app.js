"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lambdaHandler = void 0;
const lambdaHandler = async (event) => {
    const queries = JSON.stringify(event.queryStringParameters);
    //do stuff here
    console.log('ahahahahahaha');
    return {
        statusCode: 401,
        body: `Queries: ${queries}`
    };
};
exports.lambdaHandler = lambdaHandler;
//# sourceMappingURL=app.js.map