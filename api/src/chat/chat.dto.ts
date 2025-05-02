import { Socket } from 'socket.io';
import { JwtPayload } from 'src/auth/auth.dto';

export class SocketWithUserDto extends Socket {
  user: JwtPayload;
}
