import {
  Column,
  PrimaryGeneratedColumn,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  BeforeUpdate,
  ManyToMany,
  JoinTable,
} from 'typeorm';

import { User } from '../../user/entities/user.entity';

@Entity('events')
export class Event {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'datetime' })
  date: string;

  @Column({ nullable: true })
  location?: string;

  @Column({ type: 'simple-array', nullable: true })
  images?: string[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @BeforeInsert()
  normalizeBeforeInsert() {
    // 1. Normalizar el título: capitalizar primera letra de cada palabra
    if (this.title) {
      this.title = this.title
        .trim() // Eliminar espacios al inicio/final
        .toLowerCase() // Convertir todo a minúsculas
        .split(' ') // Separar por palabras
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalizar cada palabra
        .join(' '); // Unir las palabras

      // Ejemplo:
      // Input:  "   CONFERENCIA de TECNOLOGÍA   "
      // Output: "Conferencia De Tecnología"
    }

    // 2. Normalizar ubicación si existe
    if (this.location) {
      this.location = this.location.trim();
    }

    // 3. Normalizar descripción si existe
    if (this.description) {
      this.description = this.description.trim();
    }
  }

  @BeforeUpdate()
  normalizeBeforeUpdate() {
    // 1. Normalizar el título si fue modificado
    if (this.title) {
      this.title = this.title
        .trim()
        .toLowerCase()
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    }

    // 2. Normalizar ubicación si fue modificada
    if (this.location) {
      this.location = this.location.trim();
    }

    // 3. Normalizar descripción si fue modificada
    if (this.description) {
      this.description = this.description.trim();
    }
  }

  @ManyToMany(() => User, (user: User) => user.events)
  @JoinTable({
    name: 'event_attendees', // Nombre de la tabla intermedia
    joinColumn: {
      name: 'event_id', // Columna que referencia a Event
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'user_id', // Columna que referencia a User
      referencedColumnName: 'id',
    },
  })
  attendees: User[];
}
