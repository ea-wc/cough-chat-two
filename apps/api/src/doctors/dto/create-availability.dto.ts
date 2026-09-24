import { IsDateString } from 'class-validator';

export class CreateAvailabilityDto {
  @IsDateString()
  startAt: string;

  @IsDateString()
  endAt: string;
}
