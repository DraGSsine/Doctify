import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  Req,
  UseGuards,
  Query,
  UploadedFiles,
} from '@nestjs/common';
import { UploadService } from './upload.service';
import { CreateUploadDto } from './dto/create-upload.dto';
import { UpdateUploadDto } from './dto/update-upload.dto';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ObjectId } from 'mongoose';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('api/files')
@UseGuards(AuthGuard)
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('upload')
  @UseInterceptors(FilesInterceptor('files'))
  uploadFile(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Req() req: any,
  ) {
    return this.uploadService.UploadFiles(files, req.user.userId);
  }

  @Post('restore')
  async restoreFile(@Body() requestBody: { fileId: string }, @Req() req: any) {
    const { fileId } = requestBody;
    return this.uploadService.restoreFile(req, fileId);
  }
  @Get('load')
  async loadAllFiles(@Req() req: any) {
    return this.uploadService.LoadFiles(req.user.userId);
  }

  @Get('recent')
  async findRecentFiles(@Req() req: any) {
    return this.uploadService.LoadRecentFiles(req.user.userId);
  }

  @Get('removed')
  async findRemovedFiles(@Req() req: any) {
    return this.uploadService.LoadRemovedFiles(req.user.userId);
  }

  @Delete('remove')
  remove(
    @Req() req: any,
    @Body() requestBody: { fileId: string; isPremanently: boolean },
  ) {
    const { fileId, isPremanently } = requestBody;
    return this.uploadService.remove(req, fileId, isPremanently);
  }

  @Delete('removemany')
  removeMany(
    @Req() req: any,
    @Body() requestBody: { files: string[]; isPremanently: boolean },
  ) {
    const { files, isPremanently } = requestBody;
    return this.uploadService.removeMany(req, files, isPremanently);
  }
}
