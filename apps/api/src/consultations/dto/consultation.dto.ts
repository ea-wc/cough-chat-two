import { IsIn, IsOptional, IsString } from 'class-validator';

export class UpdateStateDto {
  @IsIn(['SCHEDULED', 'JOINED', 'IN_PROGRESS', 'COMPLETED'])
  state: 'SCHEDULED' | 'JOINED' | 'IN_PROGRESS' | 'COMPLETED';
}

export class NotesDto {
  @IsString()
  notes: string;

  @IsOptional()
  @IsString()
  summary?: string;
}

export class PrescriptionDto {
  @IsString()
  medication: string;

  @IsString()
  dosage: string;

  @IsOptional()
  @IsString()
  instructions?: string;
}
