import { Socket } from 'socket.io';

export class SocketWithUserDto extends Socket {
  // sub = identifier (UUID)
  user: { sub: string; email: string };
}
