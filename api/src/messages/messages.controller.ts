import { Controller, Get, HttpStatus, Param, UseGuards } from '@nestjs/common';
import { MessagesService } from './messages.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { MessagesResponseDto } from './messages.dto';

@ApiTags('messages')
@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @ApiOperation({
    summary: 'Get all messages posted to a channel',
    description: 'Get all messages posted to a channel',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Messages belonging to the given channel',
    type: [MessagesResponseDto],
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('/:channel')
  async findMessages(@Param('channel') channel: string) {
    return this.messagesService.findMessages(channel);
  }
}
