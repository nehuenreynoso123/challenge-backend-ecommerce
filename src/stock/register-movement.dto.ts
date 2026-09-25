import { IsEnum, IsInt, IsNotEmpty, IsString, Min } from 'class-validator';
import { MovementMotive } from './movement-motive.enum';
import { MovementType } from './movement-type.enum';

export class RegisterMovementDto {
  @IsString()
  @IsNotEmpty()
  sku!: string;

  @IsEnum(MovementType)
  type!: MovementType;

  @IsInt()
  @Min(1)
  quantity!: number;

  @IsEnum(MovementMotive)
  motive!: MovementMotive;
}
