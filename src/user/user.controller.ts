import { Controller, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * Crear usuario
   * POST /user
   */
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  // Endpoints para implementar después:
  // @Get() - Listar usuarios
  // @Get(':id') - Obtener usuario por ID
  // @Patch(':id') - Actualizar usuario
  // @Delete(':id') - Eliminar usuario
}
