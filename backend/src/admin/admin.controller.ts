import { Controller, Get, Post, Put, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { ProcessRepaymentDto, UpdateCommissionDto } from './dto/admin.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Admin')
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@ApiBearerAuth()
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Get admin dashboard statistics' })
  @ApiResponse({ status: 200, description: 'Dashboard statistics retrieved successfully' })
  async getDashboardStats() {
    return this.adminService.getDashboardStats();
  }

  @Get('activity')
  @ApiOperation({ summary: 'Get recent platform activity' })
  @ApiResponse({ status: 200, description: 'Recent activity retrieved successfully' })
  async getRecentActivity() {
    return this.adminService.getRecentActivity();
  }

  @Get('metrics')
  @ApiOperation({ summary: 'Get platform metrics' })
  @ApiResponse({ status: 200, description: 'Platform metrics retrieved successfully' })
  async getPlatformMetrics() {
    return this.adminService.getPlatformMetrics();
  }

  @Post('repayment')
  @ApiOperation({ summary: 'Process project repayment' })
  @ApiResponse({ status: 200, description: 'Repayment processed successfully' })
  @ApiResponse({ status: 400, description: 'Invalid repayment request' })
  async processRepayment(@Body() processRepaymentDto: ProcessRepaymentDto) {
    return this.adminService.processRepayment(processRepaymentDto);
  }

  @Get('commission-settings')
  @ApiOperation({ summary: 'Get commission settings' })
  @ApiResponse({ status: 200, description: 'Commission settings retrieved successfully' })
  async getCommissionSettings() {
    return this.adminService.getCommissionSettings();
  }

  @Put('commission-settings')
  @ApiOperation({ summary: 'Update commission settings' })
  @ApiResponse({ status: 200, description: 'Commission settings updated successfully' })
  async updateCommissionSettings(@Body() updateCommissionDto: UpdateCommissionDto) {
    return this.adminService.updateCommissionSettings(updateCommissionDto);
  }

  @Get('project/:id/investors')
  @ApiOperation({ summary: 'Get project investors' })
  @ApiResponse({ status: 200, description: 'Project investors retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Project not found' })
  async getProjectInvestors(@Param('id') id: string) {
    return this.adminService.getProjectInvestors(id);
  }
}