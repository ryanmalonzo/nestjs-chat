import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { PartialUserDto, UploadUrlResponseDto } from './users.dto';
import { UsersService } from './users.service';

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

  @ApiOperation({
    summary: 'Get profile picture upload URL',
    description: 'Get a signed URL for uploading a profile picture to S3',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The signed URL for uploading the profile picture',
    type: UploadUrlResponseDto,
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('/profile-picture/upload/:extension')
  async getProfilePictureUploadUrl(
    @Param('extension') extension: string,
  ): Promise<UploadUrlResponseDto> {
    return this.usersService.getProfilePictureUploadUrl(extension);
  }
}
