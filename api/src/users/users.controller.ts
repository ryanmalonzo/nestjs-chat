import {
  Controller,
  HttpStatus,
  Get,
  UseGuards,
  Patch,
  Body,
} from '@nestjs/common';
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
    summary: 'Get the current user',
    description: 'Get the current user',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The current user',
    type: PartialUserDto,
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('/me')
  async me(): Promise<PartialUserDto> {
    return this.usersService.me();
  }

  @ApiOperation({
    summary: 'Update the current user',
    description: 'Update the current user',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The updated user',
    type: PartialUserDto,
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Patch('/me')
  async updateUser(@Body() data: PartialUserDto): Promise<PartialUserDto> {
    return this.usersService.updateUser(data);
  }
}
