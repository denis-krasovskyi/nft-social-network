import { IsNotEmpty, IsNumber } from 'class-validator';

export class ValidationSchema {
  @IsNumber()
  @IsNotEmpty()
  PORT: number;
}
