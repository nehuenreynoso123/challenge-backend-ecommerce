import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { RegisterMovementDto } from './register-movement.dto';
import { RegisteredMovement } from './registered-movement.interface';
import { StockService } from './stock.service';

@Controller('stock')
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @Post('movimientos')
  @HttpCode(201)
  register(@Body() dto: RegisterMovementDto): Promise<RegisteredMovement> {
    return this.stockService.register(dto);
  }
}
