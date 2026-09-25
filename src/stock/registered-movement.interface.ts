import type { MovementType } from './movement-type.enum';

export interface RegisteredMovement {
  id: number;
  sku: string;
  type: MovementType;
  quantity: number;
  motive: string;
  createdAt: Date;
  available: number;
}
