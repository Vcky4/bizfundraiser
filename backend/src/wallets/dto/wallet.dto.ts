import { IsDecimal, IsString, IsOptional, IsEnum } from 'class-validator';
import { TransactionType } from '@prisma/client';

export class DepositDto {
  @IsDecimal()
  amount: number;

  @IsOptional()
  @IsString()
  description?: string;
}

export class WithdrawDto {
  @IsDecimal()
  amount: number;

  @IsOptional()
  @IsString()
  description?: string;
}

export class TransactionQueryDto {
  @IsOptional()
  @IsEnum(TransactionType)
  type?: TransactionType;

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