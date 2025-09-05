import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ProjectsService } from './projects.service';
import { CreateProjectDto, UpdateProjectDto, ProjectQueryDto, ApproveProjectDto } from './dto/project.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Projects')
@Controller('projects')
export class ProjectsController {
  constructor(private projectsService: ProjectsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new project' })
  @ApiResponse({ status: 201, description: 'Project created successfully' })
  @ApiResponse({ status: 403, description: 'Only business users can create projects' })
  async createProject(@Request() req, @Body() createProjectDto: CreateProjectDto) {
    return this.projectsService.createProject(req.user.id, createProjectDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all projects' })
  @ApiResponse({ status: 200, description: 'Projects retrieved successfully' })
  async getProjects(@Query() query: ProjectQueryDto) {
    return this.projectsService.getProjects(query);
  }

  @Get('my-projects')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user projects' })
  @ApiResponse({ status: 200, description: 'User projects retrieved successfully' })
  async getUserProjects(@Request() req) {
    return this.projectsService.getUserProjects(req.user.id);
  }

  @Get('pending')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get pending projects (Admin only)' })
  @ApiResponse({ status: 200, description: 'Pending projects retrieved successfully' })
  async getPendingProjects() {
    return this.projectsService.getPendingProjects();
  }

  @Get('stats')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get project statistics (Admin only)' })
  @ApiResponse({ status: 200, description: 'Project statistics retrieved successfully' })
  async getProjectStats() {
    return this.projectsService.getProjectStats();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get project by ID' })
  @ApiResponse({ status: 200, description: 'Project retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Project not found' })
  async getProjectById(@Param('id') id: string) {
    return this.projectsService.getProjectById(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update project' })
  @ApiResponse({ status: 200, description: 'Project updated successfully' })
  @ApiResponse({ status: 403, description: 'You can only update your own projects' })
  async updateProject(@Request() req, @Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto) {
    return this.projectsService.updateProject(req.user.id, id, updateProjectDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete project' })
  @ApiResponse({ status: 200, description: 'Project deleted successfully' })
  @ApiResponse({ status: 403, description: 'You can only delete your own projects' })
  async deleteProject(@Request() req, @Param('id') id: string) {
    return this.projectsService.deleteProject(req.user.id, id);
  }

  @Put(':id/approve')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Approve or reject project (Admin only)' })
  @ApiResponse({ status: 200, description: 'Project decision made successfully' })
  @ApiResponse({ status: 400, description: 'Only pending projects can be approved or rejected' })
  async approveProject(@Param('id') id: string, @Body() approveProjectDto: ApproveProjectDto) {
    return this.projectsService.approveProject(id, approveProjectDto);
  }
}