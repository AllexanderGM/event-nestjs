import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Event } from './entities/event.entity';
import { User } from '../user/entities/user.entity';

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(
    createEventDto: CreateEventDto,
    files?: Express.Multer.File[],
  ): Promise<Event> {
    let imagePaths: string[] | undefined = undefined;
    if (files && files.length > 0) {
      imagePaths = files.map((file) => `uploads/events/${file.filename}`);
    }

    const newEvent = this.eventRepository.create({
      ...createEventDto,
      date: new Date(createEventDto.date).toISOString(),
      images: imagePaths,
    });

    return this.eventRepository.save(newEvent);
  }

  async findAll(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [events, total] = await this.eventRepository.findAndCount({
      skip,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return {
      data: events,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<Event> {
    const event = await this.eventRepository.findOne({
      where: { id },
      relations: ['attendees'],
    });

    if (!event) {
      throw new NotFoundException(`Evento con ID ${id} no encontrado`);
    }

    return event;
  }

  async update(
    id: string,
    updateEventDto: UpdateEventDto,
    files?: Express.Multer.File[],
  ): Promise<Event> {
    const event = await this.findOne(id);

    if (files && files.length > 0) {
      const imagePaths = files.map((file) => `uploads/events/${file.filename}`);
      event.images = imagePaths;
    }

    Object.assign(event, updateEventDto);

    const dto = updateEventDto as any;
    if (dto.date) {
      event.date = new Date(dto.date).toISOString();
    }

    return this.eventRepository.save(event);
  }

  async remove(id: string): Promise<void> {
    const event = await this.findOne(id);
    await this.eventRepository.remove(event);
  }

  async registerUser(eventId: string, userId: number): Promise<Event> {
    const event = await this.findOne(eventId);
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException(`Usuario con ID ${userId} no encontrado`);
    }

    if (!event.attendees) {
      event.attendees = [];
    }

    const alreadyRegistered = event.attendees.some(
      (attendee) => attendee.id === userId,
    );

    if (alreadyRegistered) {
      throw new Error('El usuario ya está registrado en este evento');
    }

    event.attendees.push(user);
    return this.eventRepository.save(event);
  }

  async unregisterUser(eventId: string, userId: number): Promise<Event> {
    const event = await this.findOne(eventId);

    if (!event.attendees) {
      throw new Error('El evento no tiene asistentes');
    }

    event.attendees = event.attendees.filter(
      (attendee) => attendee.id !== userId,
    );

    return this.eventRepository.save(event);
  }

  async getAttendees(eventId: string): Promise<User[]> {
    const event = await this.findOne(eventId);
    return event.attendees || [];
  }
}
