import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { EventService } from './event.service';
import { Event } from './entities/event.entity';
import {
  multerConfig,
  validateFilesCount,
  validateFilesSize,
} from '../common/utils/file-upload.config';

@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Post()
  @UseInterceptors(FilesInterceptor('images', 5, multerConfig))
  async create(
    @Body() createEventDto: CreateEventDto,
    @UploadedFiles() files?: Express.Multer.File[],
  ): Promise<Event> {
    // Validar archivos si fueron enviados
    if (files && files.length > 0) {
      validateFilesCount(files);
      validateFilesSize(files);
    }

    return this.eventService.create(createEventDto, files);
  }

  @Get()
  findAll() {
    return this.eventService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.eventService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto) {
    return this.eventService.update(+id, updateEventDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.eventService.remove(+id);
  }
}
