import { BadRequestException, Injectable } from '@nestjs/common';
import type { Request } from 'express';
import { UPLOADS_URL_PREFIX } from './uploads.constants';
import type { UploadImageResponseDto } from './dto/upload-image-response.dto';

@Injectable()
export class UploadsService {
  saveImage(request: Request, file?: Express.Multer.File): UploadImageResponseDto {
    if (!file) {
      throw new BadRequestException('No se recibió ningún archivo');
    }

    const host = request.get('x-forwarded-host') ?? request.get('host');
    const backendUrl = `${request.protocol}://${host}`;

    return { url: `${backendUrl}${UPLOADS_URL_PREFIX}/${file.filename}` };
  }
}
