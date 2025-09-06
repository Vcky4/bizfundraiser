import { IsDecimal, IsOptional, IsString, Min } from 'class-validator';

export class CreateInvestmentDto {
  @IsString()
  projectId: string;

  @IsDecimal()
  @Min(100)
  amount: number;
}

export class InvestmentQueryDto {
  @IsOptional()
  @IsString()
  projectId?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  page?: string;

  @IsOptional()
  @IsString()
  limit?: string;
}