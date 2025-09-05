import { IsString, IsDecimal, IsInt, IsOptional, IsArray, Min, Max } from 'class-validator';

export class CreateProjectDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsDecimal()
  @Min(1000)
  amountRequested: number;

  @IsInt()
  @Min(1)
  @Max(60)
  duration: number; // in months

  @IsDecimal()
  @Min(5)
  @Max(50)
  expectedROI: number; // percentage

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  documents?: string[];
}

export class UpdateProjectDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsDecimal()
  @Min(1000)
  amountRequested?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(60)
  duration?: number;

  @IsOptional()
  @IsDecimal()
  @Min(5)
  @Max(50)
  expectedROI?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  documents?: string[];
}

export class ProjectQueryDto {
  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  page?: string;

  @IsOptional()
  @IsString()
  limit?: string;
}

export class ApproveProjectDto {
  @IsString()
  decision: 'approve' | 'reject';

  @IsOptional()
  @IsString()
  reason?: string;
}