import { Controller, Get, HttpStatus, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ChannelsService } from './channels.service';
import { AuthGuard } from 'src/auth/auth.guard';

@ApiTags('channels')
@Controller('channels')
export class ChannelsController {
  constructor(private readonly channelsService: ChannelsService) {}

  @ApiOperation({ summary: 'Get all channels' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Channels retrieved successfully',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get()
  getChannels() {
    return this.channelsService.getChannels();
  }
}
