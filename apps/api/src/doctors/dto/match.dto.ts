import { IsArray, IsOptional, IsString } from 'class-validator';

export class MatchDto {
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  symptoms?: string[];

  @IsOptional()
  @IsString()
  description?: string;
}
