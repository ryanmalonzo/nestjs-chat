export interface RegisterUserDto {
  email: string;
  plainPassword: string;
}

export interface LoginUserDto extends RegisterUserDto {}

export interface JwtResponse {
  accessToken: string;
}

export interface UserResponse {
  identifier: string;
  username: string;
  email: string;
  profilePictureUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MessageResponse {
  identifier: string;
  fromUserIdentifier: string;
  channel: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  fromUser: {
    identifier: string;
    username: string;
    email: string;
    createdAt: string;
    updatedAt: string;
  };
}

export interface UploadUrlResponseType {
  url: string;
}
