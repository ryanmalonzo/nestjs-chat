import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Socket } from 'socket.io';
import { JwtPayloadDto } from './auth.dto';

interface AuthenticatedSocket extends Socket {
  data: {
    user: JwtPayloadDto;
  };
}

export const WsUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): JwtPayloadDto => {
    const client = ctx.switchToWs().getClient<AuthenticatedSocket>();
    return client.data.user;
  },
);
