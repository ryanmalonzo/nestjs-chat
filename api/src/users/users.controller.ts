import { Controller, HttpStatus, Get, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { PartialUserDto } from './users.dto';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({
    summary: 'Get information about the current user',
    description: 'Get information about the current user',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The information of the current user',
    type: PartialUserDto,
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('/me')
  async me(): Promise<PartialUserDto> {
    return this.usersService.me();
  }
}
