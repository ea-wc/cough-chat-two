import { IsIn, IsOptional, IsString } from 'class-validator';

export class UpdateUserStatusDto {
  @IsIn(['ACTIVE', 'SUSPENDED', 'DEACTIVATED'])
  status: 'ACTIVE' | 'SUSPENDED' | 'DEACTIVATED';

  @IsOptional()
  @IsString()
  reason?: string;
}

export class ReviewDoctorDto {
  @IsIn(['APPROVED', 'REJECTED', 'PENDING'])
  approvalStatus: 'APPROVED' | 'REJECTED' | 'PENDING';

  @IsOptional()
  @IsString()
  specialization?: string;

  @IsOptional()
  @IsString()
  bio?: string;
}
