export interface RegisterUserDto {
  email: string;
  plainPassword: string;
}

export type LoginUserDto = RegisterUserDto;

export type ChatBubbleColor = 'blue' | 'indigo' | 'pink' | 'red' | 'orange' | 'amber' | 'emerald';

export interface JwtResponse {
  accessToken: string;
}

export interface UserResponse {
  identifier: string;
  username: string;
  email: string;
  profilePictureUrl?: string;
  chatBubbleColor?: ChatBubbleColor;
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
    profilePictureUrl: string | null;
    chatBubbleColor?: ChatBubbleColor;
    createdAt: string;
    updatedAt: string;
  };
}

export interface UploadUrlResponseType {
  url: string;
}

export interface Channel {
  identifier: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}
