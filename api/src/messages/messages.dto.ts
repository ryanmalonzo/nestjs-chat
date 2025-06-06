import { ApiProperty } from '@nestjs/swagger';
import { ChatBubbleColor, Prisma } from '@prisma/client';

export type MessagesResponseType = Prisma.MessageGetPayload<{
  include: {
    fromUser: {
      omit: {
        hashedPassword: true;
      };
    };
  };
}>;

export class MessagesResponseDto implements MessagesResponseType {
  @ApiProperty({
    description: 'Unique identifier of the message',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  identifier: string;

  @ApiProperty({
    description: 'Identifier of the user who sent the message',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  fromUserIdentifier: string;

  @ApiProperty({
    description: 'Identifier of the channel where the message was sent',
    example: '123e4567-e89b-12d3-a456-426614174002',
  })
  channelIdentifier: string;

  @ApiProperty({
    description: 'Channel where the message was posted',
    example: 'general',
  })
  channel: string;

  @ApiProperty({
    description: 'Content of the message',
    example: 'Hello, world!',
  })
  content: string;

  @ApiProperty({
    description: 'Date when the message was created',
    example: '2023-01-01T12:00:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Date when the message was last updated',
    example: '2023-01-01T12:00:00Z',
  })
  updatedAt: Date;

  @ApiProperty({
    description: 'Information about the user who sent the message',
    type: 'object',
    properties: {
      identifier: {
        type: 'string',
        description: 'Unique identifier of the user',
        example: '123e4567-e89b-12d3-a456-426614174001',
      },
      email: {
        type: 'string',
        description: 'Email of the user',
        example: 'john.doe@example.com',
      },
      profilePictureUrl: {
        type: 'string',
        description: 'URL of the user profile picture',
        example: 'https://example.com/profiles/user123.jpg',
        nullable: true,
      },
      createdAt: {
        type: 'string',
        format: 'date-time',
        description: 'Date when the user account was created',
        example: '2023-01-01T12:00:00Z',
      },
      updatedAt: {
        type: 'string',
        format: 'date-time',
        description: 'Date when the user account was last updated',
        example: '2023-01-01T12:00:00Z',
      },
    },
  })
  fromUser: {
    identifier: string;
    username: string;
    email: string;
    profilePictureUrl: string | null;
    chatBubbleColor: ChatBubbleColor;
    createdAt: Date;
    updatedAt: Date;
  };
}
