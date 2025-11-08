import {
  IsString,
  IsNotEmpty,
  MaxLength,
  IsOptional,
  IsBoolean,
  IsUrl,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  displayName: string;

  @IsUrl()
  @IsOptional()
  avatarUrl?: string;

  @IsString()
  @IsOptional()
  originWorld?: string;

  @IsBoolean()
  @IsOptional()
  isAlive?: boolean;
}
