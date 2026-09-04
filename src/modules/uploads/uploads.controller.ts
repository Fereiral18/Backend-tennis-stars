import { randomUUID } from 'node:crypto';
import { extname } from 'node:path';
import {
  BadRequestException,
  Controller,
  Post,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Request } from 'express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { Role } from '@prisma/client';
import { Roles } from '@/common/decorators/roles.decorator';
import { UploadsService } from './uploads.service';
import { UploadImageResponseDto } from './dto/upload-image-response.dto';
import { ALLOWED_IMAGE_MIME_TYPES, MAX_IMAGE_SIZE_BYTES, UPLOADS_DIR } from './uploads.constants';

@ApiTags('Uploads')
@ApiBearerAuth('access-token')
@Roles(Role.ADMIN)
@Controller('uploads')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Post('image')
  @ApiOperation({ summary: 'Upload a product image (admin only)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: { file: { type: 'string', format: 'binary' } },
    },
  })
  @ApiCreatedResponse({ description: 'Image uploaded', type: UploadImageResponseDto })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: UPLOADS_DIR,
        filename: (_req, file, callback) => {
          callback(null, `${randomUUID()}${extname(file.originalname)}`);
        },
      }),
      limits: { fileSize: MAX_IMAGE_SIZE_BYTES },
      fileFilter: (_req, file, callback) => {
        if (!ALLOWED_IMAGE_MIME_TYPES.includes(file.mimetype)) {
          callback(
            new BadRequestException('Solo se permiten imágenes (jpg, png, webp, gif)'),
            false,
          );
          return;
        }

        callback(null, true);
      },
    }),
  )
  uploadImage(
    @Req() request: Request,
    @UploadedFile() file?: Express.Multer.File,
  ): UploadImageResponseDto {
    return this.uploadsService.saveImage(request, file);
  }
}
