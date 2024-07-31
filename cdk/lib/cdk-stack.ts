import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { CartServiceApi } from "../main/constructs/api";
import { CartServiceHandlers } from "../main/constructs/handlers";

export class CdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const handlers = new CartServiceHandlers(this, 'CartLambdaFn', {});
    new CartServiceApi(this, 'CartServiceAPI', {
      handler: handlers.handler
    });
  }
}
