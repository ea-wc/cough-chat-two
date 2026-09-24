import { IsOptional, IsString } from 'class-validator';

export class BookAppointmentDto {
  @IsString()
  availabilityId: string;

  @IsOptional()
  @IsString()
  symptoms?: string;
}
