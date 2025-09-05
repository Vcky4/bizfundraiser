import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProfileDto, UpdateBusinessProfileDto } from './dto/update-profile.dto';
import { UserRole } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        kycCompleted: true,
        idNumber: true,
        idDocument: true,
        address: true,
        dateOfBirth: true,
        businessName: true,
        cacNumber: true,
        taxId: true,
        businessAddress: true,
        businessDocuments: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async updateProfile(userId: string, updateProfileDto: UpdateProfileDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: updateProfileDto,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        kycCompleted: true,
        idNumber: true,
        idDocument: true,
        address: true,
        dateOfBirth: true,
        businessName: true,
        cacNumber: true,
        taxId: true,
        businessAddress: true,
        businessDocuments: true,
        updatedAt: true,
      },
    });

    return updatedUser;
  }

  async updateBusinessProfile(userId: string, updateBusinessProfileDto: UpdateBusinessProfileDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.role !== UserRole.BUSINESS) {
      throw new ForbiddenException('Only business users can update business profile');
    }

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: updateBusinessProfileDto,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        kycCompleted: true,
        idNumber: true,
        idDocument: true,
        address: true,
        dateOfBirth: true,
        businessName: true,
        cacNumber: true,
        taxId: true,
        businessAddress: true,
        businessDocuments: true,
        updatedAt: true,
      },
    });

    return updatedUser;
  }

  async completeKYC(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check if all required KYC fields are filled
    const requiredFields = ['firstName', 'lastName', 'phone', 'address', 'idNumber', 'idDocument'];
    const businessRequiredFields = user.role === UserRole.BUSINESS 
      ? ['businessName', 'cacNumber', 'taxId', 'businessAddress']
      : [];

    const allRequiredFields = [...requiredFields, ...businessRequiredFields];
    const missingFields = allRequiredFields.filter(field => !user[field]);

    if (missingFields.length > 0) {
      throw new ForbiddenException(`Missing required KYC fields: ${missingFields.join(', ')}`);
    }

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: { kycCompleted: true },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        kycCompleted: true,
        idNumber: true,
        idDocument: true,
        address: true,
        dateOfBirth: true,
        businessName: true,
        cacNumber: true,
        taxId: true,
        businessAddress: true,
        businessDocuments: true,
        updatedAt: true,
      },
    });

    return updatedUser;
  }

  async getAllUsers() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        kycCompleted: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}