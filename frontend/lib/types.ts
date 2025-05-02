export interface RegisterUserDto {
  email: string;
  plainPassword: string;
}

export interface LoginUserDto extends RegisterUserDto { }

export interface JwtResponse {
  accessToken: string;
}
