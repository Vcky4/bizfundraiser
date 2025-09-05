import { IsOptional, IsString, IsDateString, IsArray } from 'class-validator';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @IsOptional()
  @IsString()
  idNumber?: string;

  @IsOptional()
  @IsString()
  idDocument?: string;
}

export class UpdateBusinessProfileDto extends UpdateProfileDto {
  @IsOptional()
  @IsString()
  businessName?: string;

  @IsOptional()
  @IsString()
  cacNumber?: string;

  @IsOptional()
  @IsString()
  taxId?: string;

  @IsOptional()
  @IsString()
  businessAddress?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  businessDocuments?: string[];
}