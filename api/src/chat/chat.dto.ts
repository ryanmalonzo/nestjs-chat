import { Socket } from 'socket.io';
import { JwtPayloadDto } from 'src/auth/auth.dto';

export class SocketWithUserDto extends Socket {
  user: JwtPayloadDto;
}
