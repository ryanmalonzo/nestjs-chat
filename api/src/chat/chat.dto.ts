import { Socket } from 'socket.io';
import { JwtPayloadDto } from 'src/auth/auth.dto';

export class SocketWithUserDto extends Socket {
  user: JwtPayloadDto;
}

export class ChannelMessageDto {
  channel: string;
  content: string;
}
