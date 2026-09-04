import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UPLOADS_URL_PREFIX } from './uploads.constants';
import type { UploadImageResponseDto } from './dto/upload-image-response.dto';

@Injectable()
export class UploadsService {
  constructor(private readonly configService: ConfigService) {}

  saveImage(file?: Express.Multer.File): UploadImageResponseDto {
    if (!file) {
      throw new BadRequestException('No se recibió ningún archivo');
    }

    const backendUrl = this.configService.getOrThrow<string>('app.backendUrl');

    return { url: `${backendUrl}${UPLOADS_URL_PREFIX}/${file.filename}` };
  }
}
