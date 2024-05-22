import fastifyMultipart from '@fastify/multipart';
import { Logger } from '@nestjs/common';
import { FastifyAdapter } from '@nestjs/platform-fastify';
import { ulid } from 'ulid';

import { USER_AGENT, X_REQUEST_ID } from '@src/constants/rest.constant';

const app: FastifyAdapter = new FastifyAdapter({
  logger: false,
});
export { app as fastifyApp };

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
app.register(fastifyMultipart, {
  limits: {
    fields: 10, // Max number of non-file fields
    fileSize: 1024 * 1024 * 6, // limit size 6M
    files: 5, // Max number of file fields
  },
});

app.getInstance().addHook('onRequest', async (request) => {
  if (!request.headers[X_REQUEST_ID]) {
    request.headers[X_REQUEST_ID] = ulid();
  }
});

app.getInstance().addHook('onError', async (request, reply) => {
  const ip = request.ip;
  const userAgent = request.headers[USER_AGENT];
  const url = request.url;

  Logger.log(`NotFound: IP:${ip}, UA+${userAgent}, URL=${url}`);

  reply.status(500).send({ error: 'error' });
});
