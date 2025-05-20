import { Controller, Param, Get, HttpStatus, UseGuards } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { UploadUrlResponseType } from './documents.dto';

@ApiTags('documents')
@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @ApiOperation({
    summary: 'Get upload URL',
    description: 'Get a signed URL for uploading a file to S3',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The signed URL for uploading the file',
    type: UploadUrlResponseType,
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('/upload/:type')
  getUploadUrl(@Param('type') type: string): Promise<UploadUrlResponseType> {
    return this.documentsService.getUploadUrl(type);
  }
}
