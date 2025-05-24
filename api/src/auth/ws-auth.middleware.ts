import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Socket } from 'socket.io';
import { JwtPayloadDto } from './auth.dto';

interface AuthenticatedSocket extends Socket {
  data: {
    user: JwtPayloadDto;
  };
}

@Injectable()
export class WsAuthMiddleware {
  private readonly logger = new Logger(WsAuthMiddleware.name);

  constructor(private readonly jwtService: JwtService) {}

  async authenticateSocket(socket: Socket): Promise<void> {
    try {
      const token = this.extractTokenFromSocket(socket);
      if (!token) {
        throw new UnauthorizedException('No token provided');
      }

      const payload = await this.jwtService.verifyAsync<JwtPayloadDto>(token, {
        secret: process.env.JWT_SECRET,
      });

      // Attach user to socket data for later use
      (socket as AuthenticatedSocket).data = {
        user: payload,
      };

      this.logger.log(
        `Socket ${socket.id} authenticated for user ${payload.email}`,
      );
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.warn(
        `Authentication failed for socket ${socket.id}: ${errorMessage}`,
      );
      socket.disconnect();
      throw new UnauthorizedException('Invalid token');
    }
  }

  private extractTokenFromSocket(socket: Socket): string | undefined {
    // Try to get token from auth object (passed during connection)
    const authToken = socket.handshake.auth?.token as string | undefined;
    if (authToken && typeof authToken === 'string') {
      return authToken;
    }

    // Fallback to headers for backward compatibility
    const authHeader = socket.handshake.headers.authorization;
    if (authHeader && typeof authHeader === 'string') {
      const [type, token] = authHeader.split(' ');
      return type === 'Bearer' ? token : undefined;
    }

    return undefined;
  }
}
