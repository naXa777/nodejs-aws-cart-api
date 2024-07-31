import { Code, Runtime, Function } from "aws-cdk-lib/aws-lambda";
import type { IFunction } from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";

export class CartServiceHandlers extends Construct {
    public readonly handler: IFunction;

    constructor(scope: Construct, id: string, props: any) {
        super(scope, id);

        this.handler = new Function(this, 'CartLambdaFn', {
            runtime: Runtime.NODEJS_18_X,
            handler: 'lambda.handler',
            code: Code.fromAsset('../dist/src/lambda'),
        });
    }
}
