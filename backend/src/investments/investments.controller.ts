import { Controller, Get, Post, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { InvestmentsService } from './investments.service';
import { CreateInvestmentDto, InvestmentQueryDto } from './dto/investment.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Investments')
@Controller('investments')
export class InvestmentsController {
  constructor(private investmentsService: InvestmentsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new investment' })
  @ApiResponse({ status: 201, description: 'Investment created successfully' })
  @ApiResponse({ status: 403, description: 'Only investors can make investments' })
  @ApiResponse({ status: 400, description: 'Invalid investment request' })
  async createInvestment(@Request() req, @Body() createInvestmentDto: CreateInvestmentDto) {
    return this.investmentsService.createInvestment(req.user.id, createInvestmentDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user investments' })
  @ApiResponse({ status: 200, description: 'Investments retrieved successfully' })
  async getInvestments(@Request() req, @Query() query: InvestmentQueryDto) {
    return this.investmentsService.getInvestments(req.user.id, query);
  }

  @Get('stats')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get investment statistics' })
  @ApiResponse({ status: 200, description: 'Investment statistics retrieved successfully' })
  async getInvestmentStats(@Request() req) {
    return this.investmentsService.getInvestmentStats(req.user.id);
  }

  @Get('all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all investments (Admin only)' })
  @ApiResponse({ status: 200, description: 'All investments retrieved successfully' })
  async getAllInvestments(@Query() query: InvestmentQueryDto) {
    return this.investmentsService.getAllInvestments(query);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get investment by ID' })
  @ApiResponse({ status: 200, description: 'Investment retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Investment not found' })
  async getInvestmentById(@Request() req, @Param('id') id: string) {
    return this.investmentsService.getInvestmentById(req.user.id, id);
  }
}