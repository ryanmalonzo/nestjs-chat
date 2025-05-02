import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtResponseDto, LoginUserDto, RegisterUserDto } from './auth.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: 'Register a user',
    description: 'Register a user with email address and password',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The user has been registered successfully',
    type: JwtResponseDto,
  })
  @Post('/register')
  register(@Body() data: RegisterUserDto): Promise<JwtResponseDto> {
    return this.authService.register(data);
  }

  @ApiOperation({
    summary: 'Login as a user',
    description: 'Login as a user with email address and password',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Logged in successfully as the user',
    type: JwtResponseDto,
  })
  @HttpCode(HttpStatus.OK)
  @Post('/login')
  login(@Body() data: LoginUserDto): Promise<JwtResponseDto> {
    return this.authService.login(data);
  }
}
