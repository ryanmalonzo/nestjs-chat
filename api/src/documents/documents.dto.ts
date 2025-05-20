import { ApiProperty } from '@nestjs/swagger';

export class UploadUrlResponseType {
  @ApiProperty({
    description: 'The URL to upload the file',
    example: 'https://example.com/upload/12345',
  })
  url: string;
}
