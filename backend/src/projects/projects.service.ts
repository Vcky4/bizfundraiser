import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectDto, UpdateProjectDto, ProjectQueryDto, ApproveProjectDto } from './dto/project.dto';
import { ProjectStatus, UserRole } from '@prisma/client';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  async createProject(userId: string, createProjectDto: CreateProjectDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.role !== UserRole.BUSINESS) {
      throw new ForbiddenException('Only business users can create projects');
    }

    if (!user.kycCompleted) {
      throw new ForbiddenException('KYC must be completed before creating projects');
    }

    const project = await this.prisma.project.create({
      data: {
        ...createProjectDto,
        businessId: userId,
      },
      include: {
        business: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            businessName: true,
          },
        },
      },
    });

    return project;
  }

  async getProjects(query: ProjectQueryDto) {
    const { status, search, page = '1', limit = '10' } = query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const where: any = { isActive: true };

    if (status) {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { business: { businessName: { contains: search, mode: 'insensitive' } } },
      ];
    }

    const [projects, total] = await Promise.all([
      this.prisma.project.findMany({
        where,
        include: {
          business: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              businessName: true,
            },
          },
          investments: {
            select: {
              id: true,
              amount: true,
              createdAt: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limitNum,
      }),
      this.prisma.project.count({ where }),
    ]);

    return {
      projects,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    };
  }

  async getProjectById(id: string) {
    const project = await this.prisma.project.findUnique({
      where: { id },
      include: {
        business: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            businessName: true,
            kycCompleted: true,
          },
        },
        investments: {
          include: {
            investor: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return project;
  }

  async getUserProjects(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.role !== UserRole.BUSINESS) {
      throw new ForbiddenException('Only business users can view their projects');
    }

    const projects = await this.prisma.project.findMany({
      where: { businessId: userId },
      include: {
        investments: {
          include: {
            investor: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return projects;
  }

  async updateProject(userId: string, projectId: string, updateProjectDto: UpdateProjectDto) {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    if (project.businessId !== userId) {
      throw new ForbiddenException('You can only update your own projects');
    }

    if (project.status !== ProjectStatus.PENDING) {
      throw new BadRequestException('Only pending projects can be updated');
    }

    const updatedProject = await this.prisma.project.update({
      where: { id: projectId },
      data: updateProjectDto,
      include: {
        business: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            businessName: true,
          },
        },
      },
    });

    return updatedProject;
  }

  async deleteProject(userId: string, projectId: string) {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    if (project.businessId !== userId) {
      throw new ForbiddenException('You can only delete your own projects');
    }

    if (project.status !== ProjectStatus.PENDING) {
      throw new BadRequestException('Only pending projects can be deleted');
    }

    await this.prisma.project.update({
      where: { id: projectId },
      data: { isActive: false },
    });

    return { message: 'Project deleted successfully' };
  }

  async approveProject(projectId: string, approveProjectDto: ApproveProjectDto) {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    if (project.status !== ProjectStatus.PENDING) {
      throw new BadRequestException('Only pending projects can be approved or rejected');
    }

    const status = approveProjectDto.decision === 'approve' 
      ? ProjectStatus.APPROVED 
      : ProjectStatus.REJECTED;

    const updatedProject = await this.prisma.project.update({
      where: { id: projectId },
      data: {
        status,
        approvedAt: new Date(),
      },
      include: {
        business: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            businessName: true,
          },
        },
      },
    });

    return updatedProject;
  }

  async getPendingProjects() {
    const projects = await this.prisma.project.findMany({
      where: { 
        status: ProjectStatus.PENDING,
        isActive: true,
      },
      include: {
        business: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            businessName: true,
            kycCompleted: true,
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    return projects;
  }

  async getProjectStats() {
    const [
      totalProjects,
      pendingProjects,
      approvedProjects,
      fundedProjects,
      repaidProjects,
      totalAmountRequested,
      totalAmountRaised,
    ] = await Promise.all([
      this.prisma.project.count({ where: { isActive: true } }),
      this.prisma.project.count({ where: { status: ProjectStatus.PENDING, isActive: true } }),
      this.prisma.project.count({ where: { status: ProjectStatus.APPROVED, isActive: true } }),
      this.prisma.project.count({ where: { status: ProjectStatus.FUNDED, isActive: true } }),
      this.prisma.project.count({ where: { status: ProjectStatus.REPAID, isActive: true } }),
      this.prisma.project.aggregate({
        where: { isActive: true },
        _sum: { amountRequested: true },
      }),
      this.prisma.project.aggregate({
        where: { isActive: true },
        _sum: { amountRaised: true },
      }),
    ]);

    return {
      totalProjects,
      pendingProjects,
      approvedProjects,
      fundedProjects,
      repaidProjects,
      totalAmountRequested: totalAmountRequested._sum.amountRequested || 0,
      totalAmountRaised: totalAmountRaised._sum.amountRaised || 0,
    };
  }
}