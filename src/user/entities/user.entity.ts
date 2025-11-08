import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
} from 'typeorm';

import { Event } from '../../event/entities/event.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  displayName: string;

  @Column({ nullable: true })
  avatarUrl?: string;

  @Column({ nullable: true })
  originWorld: string;

  @Column({ default: true })
  isAlive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToMany(() => Event, (event: Event) => event.attendees)
  events: Event[];
}
