import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CreateEventDto } from './dto/create-event.dto';
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

  /**
   * Crear evento con imágenes opcionales
   * POST /event
   */
  @Post()
  @UseInterceptors(FilesInterceptor('images', 5, multerConfig))
  async create(
    @Body() createEventDto: CreateEventDto,
    @UploadedFiles() files?: Express.Multer.File[],
  ): Promise<Event> {
    if (files && files.length > 0) {
      validateFilesCount(files);
      validateFilesSize(files);
    }

    return this.eventService.create(createEventDto, files);
  }

  /**
   * Listar eventos con paginación
   * GET /event?page=1&limit=10
   */
  @Get()
  findAll(@Query('page') page?: number, @Query('limit') limit?: number) {
    return this.eventService.findAll(page || 1, limit || 10);
  }

  /**
   * Asignar usuario a evento
   * POST /event/:id/register/:userId
   */
  @Post(':id/register/:userId')
  registerUser(@Param('id') id: string, @Param('userId') userId: number) {
    return this.eventService.registerUser(id, +userId);
  }

  /**
   * Ver asistentes de un evento
   * GET /event/:id/attendees
   */
  @Get(':id/attendees')
  getAttendees(@Param('id') id: string) {
    return this.eventService.getAttendees(id);
  }

  // Endpoints para implementar después:
  // @Get(':id') - Obtener evento por ID
  // @Patch(':id') - Actualizar evento
  // @Delete(':id') - Eliminar evento
  // @Delete(':id/unregister/:userId') - Quitar usuario de evento
}
