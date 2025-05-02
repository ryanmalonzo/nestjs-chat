import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, CreateUserResponseDto } from './users.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({
    summary: 'Create a user',
    description: 'Create a user with email address and password',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The user has been created successfully',
    type: CreateUserResponseDto,
  })
  @Post()
  createUser(@Body() data: CreateUserDto): Promise<CreateUserResponseDto> {
    return this.usersService.createUser(data);
  }
}
