import { Controller, Get, Put, Post, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UpdateProfileDto, UpdateBusinessProfileDto } from './dto/update-profile.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Users')
@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('profile')
  @ApiOperation({ summary: 'Get user profile' })
  @ApiResponse({ status: 200, description: 'Profile retrieved successfully' })
  async getProfile(@Request() req) {
    return this.usersService.getProfile(req.user.id);
  }

  @Put('profile')
  @ApiOperation({ summary: 'Update user profile' })
  @ApiResponse({ status: 200, description: 'Profile updated successfully' })
  async updateProfile(@Request() req, @Body() updateProfileDto: UpdateProfileDto) {
    return this.usersService.updateProfile(req.user.id, updateProfileDto);
  }

  @Put('business-profile')
  @ApiOperation({ summary: 'Update business profile' })
  @ApiResponse({ status: 200, description: 'Business profile updated successfully' })
  @ApiResponse({ status: 403, description: 'Only business users can update business profile' })
  async updateBusinessProfile(@Request() req, @Body() updateBusinessProfileDto: UpdateBusinessProfileDto) {
    return this.usersService.updateBusinessProfile(req.user.id, updateBusinessProfileDto);
  }

  @Post('complete-kyc')
  @ApiOperation({ summary: 'Complete KYC verification' })
  @ApiResponse({ status: 200, description: 'KYC completed successfully' })
  @ApiResponse({ status: 403, description: 'Missing required KYC fields' })
  async completeKYC(@Request() req) {
    return this.usersService.completeKYC(req.user.id);
  }

  @Get('all')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get all users (Admin only)' })
  @ApiResponse({ status: 200, description: 'Users retrieved successfully' })
  async getAllUsers() {
    return this.usersService.getAllUsers();
  }
}