import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import serverlessExpress from '@codegenie/serverless-express';
import { Context, Handler } from 'aws-lambda';
import express from 'express';
import helmet from 'helmet';

import { AppModule } from './app.module';

// singleton with lazy initialization
let cachedServer: Handler;

async function bootstrap() {
  if (!cachedServer) {
    const expressApp = express();
    const app = await NestFactory.create(
        AppModule,
        new ExpressAdapter(expressApp),
    );

    app.enableCors({
      origin: (req, callback) => callback(null, true),
    });
    app.use(helmet());

    await app.init();

    cachedServer = serverlessExpress({ app: expressApp });
  }

  return cachedServer;
}

export const npm = async (event: any, context: Context, callback: any) => {
  const server = await bootstrap();

  return server(event, context, callback);
};
