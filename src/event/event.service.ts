import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Event } from './entities/event.entity';

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
  ) {}

  async create(
    createEventDto: CreateEventDto,
    files?: Express.Multer.File[],
  ): Promise<Event> {
    let imagePaths: string[] | undefined = undefined;
    if (files && files.length > 0) {
      imagePaths = files.map((file) => `uploads/events/${file.filename}`);
    }

    // Crea una instancia del evento con los datos del DTO
    const newEvent = this.eventRepository.create({
      ...createEventDto,
      date: new Date(createEventDto.date).toISOString(),
      images: imagePaths,
    });

    return this.eventRepository.save(newEvent);
  }

  findAll() {
    return `This action returns all event`;
  }

  findOne(id: number) {
    return `This action returns a #${id} event`;
  }

  update(id: number, updateEventDto: UpdateEventDto) {
    return `This action updates a #${id} event`;
  }

  remove(id: number) {
    return `This action removes a #${id} event`;
  }
}
