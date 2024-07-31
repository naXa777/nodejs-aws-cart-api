import { Cors, LambdaIntegration, RestApi } from "aws-cdk-lib/aws-apigateway";
import type { IFunction } from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";

interface Props {
    handler: IFunction
}

export class CartServiceApi extends Construct {
    constructor(scope: Construct, id: string, props: Props) {
        super(scope, id);

        const api = new RestApi(this, 'CartServiceAPI', {
            restApiName: 'NestJS REST API'
        });
        const proxyResource = api.root.addResource('{proxy+}'); // catch-all for any subpath
        proxyResource.addMethod('ANY', new LambdaIntegration(props.handler));
        proxyResource.addCorsPreflight({
            allowOrigins: Cors.ALL_ORIGINS,
            allowMethods: ['OPTIONS', 'GET', 'POST', 'PUT', 'DELETE'],
            allowHeaders: Cors.DEFAULT_HEADERS
        });
    }
}