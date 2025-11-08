import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { EventModule } from './event/event.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    EventModule,
    UserModule,
    ConfigModule.forRoot({
      isGlobal: true, // Disponible globalmente sin necesidad de importar
      envFilePath: '.env', // Archivo de configuración
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        // Tipo de base de datos (mysql por defecto)
        type: configService.get<
          | 'mysql'
          | 'postgres'
          | 'mariadb'
          | 'sqlite'
          | 'mssql'
          | 'oracle'
          | 'mongodb'
        >('DB_TYPE', 'mysql'),

        // Configuración de conexión
        host: configService.get<string>('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 3306),
        username: configService.get<string>('DB_USER', 'user'),
        password: configService.get<string>(
          'DB_PASSWORD',
          'soy_una_contrasenia_segura',
        ),
        database: configService.get<string>('DB_NAME', 'mydatabase'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],

        // ADVERTENCIA: En producción debe ser false para evitar pérdida de datos
        synchronize: true,

        // logging: false -> No muestra las queries SQL en consola
        logging: false,
      }),
      inject: [ConfigService],
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
