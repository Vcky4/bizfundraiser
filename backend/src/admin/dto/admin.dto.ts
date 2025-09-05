import { IsDecimal, IsString, IsOptional, Min } from 'class-validator';

export class ProcessRepaymentDto {
  @IsString()
  projectId: string;

  @IsDecimal()
  @Min(0)
  totalRepayment: number;
}

export class UpdateCommissionDto {
  @IsDecimal()
  @Min(0)
  @IsOptional()
  fundingCommission?: number;

  @IsDecimal()
  @Min(0)
  @IsOptional()
  profitCommission?: number;
}