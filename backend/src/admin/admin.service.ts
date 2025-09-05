import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { InvestmentsService } from '../investments/investments.service';
import { ProcessRepaymentDto, UpdateCommissionDto } from './dto/admin.dto';
import { ProjectStatus, UserRole } from '@prisma/client';

@Injectable()
export class AdminService {
  constructor(
    private prisma: PrismaService,
    private investmentsService: InvestmentsService,
  ) {}

  async getDashboardStats() {
    const [
      totalUsers,
      totalInvestors,
      totalBusinesses,
      totalProjects,
      pendingProjects,
      fundedProjects,
      totalInvestments,
      totalAmountInvested,
      totalAmountRaised,
      platformRevenue,
    ] = await Promise.all([
      this.prisma.user.count({ where: { isActive: true } }),
      this.prisma.user.count({ where: { role: UserRole.INVESTOR, isActive: true } }),
      this.prisma.user.count({ where: { role: UserRole.BUSINESS, isActive: true } }),
      this.prisma.project.count({ where: { isActive: true } }),
      this.prisma.project.count({ where: { status: ProjectStatus.PENDING, isActive: true } }),
      this.prisma.project.count({ where: { status: ProjectStatus.FUNDED, isActive: true } }),
      this.prisma.investment.count(),
      this.prisma.investment.aggregate({
        _sum: { amount: true },
      }),
      this.prisma.project.aggregate({
        _sum: { amountRaised: true },
      }),
      this.prisma.commission.aggregate({
        _sum: { amount: true },
      }),
    ]);

    return {
      users: {
        total: totalUsers,
        investors: totalInvestors,
        businesses: totalBusinesses,
      },
      projects: {
        total: totalProjects,
        pending: pendingProjects,
        funded: fundedProjects,
      },
      investments: {
        total: totalInvestments,
        totalAmount: totalAmountInvested._sum.amount || 0,
      },
      platform: {
        totalRaised: totalAmountRaised._sum.amountRaised || 0,
        revenue: platformRevenue._sum.amount || 0,
      },
    };
  }

  async getRecentActivity() {
    const [recentUsers, recentProjects, recentInvestments] = await Promise.all([
      this.prisma.user.findMany({
        where: { isActive: true },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          role: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
      this.prisma.project.findMany({
        where: { isActive: true },
        select: {
          id: true,
          title: true,
          status: true,
          amountRequested: true,
          amountRaised: true,
          createdAt: true,
          business: {
            select: {
              businessName: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
      this.prisma.investment.findMany({
        select: {
          id: true,
          amount: true,
          createdAt: true,
          investor: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
          project: {
            select: {
              title: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
    ]);

    return {
      recentUsers,
      recentProjects,
      recentInvestments,
    };
  }

  async processRepayment(processRepaymentDto: ProcessRepaymentDto) {
    const { projectId, totalRepayment } = processRepaymentDto;

    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    if (project.status !== ProjectStatus.FUNDED) {
      throw new BadRequestException('Project must be funded before processing repayment');
    }

    // Process repayments to all investors
    await this.investmentsService.processRepayment(projectId, totalRepayment);

    // Calculate and record platform commission
    const totalInvested = project.amountRaised;
    const profit = totalRepayment - Number(totalInvested);
    const platformCommission = profit * 0.05; // 5% of profit

    if (platformCommission > 0) {
      await this.prisma.commission.create({
        data: {
          projectId,
          amount: platformCommission,
          percentage: 5.0,
          type: 'profit',
        },
      });
    }

    return { message: 'Repayment processed successfully' };
  }

  async getCommissionSettings() {
    // In a real application, this would be stored in a configuration table
    return {
      fundingCommission: 2.5, // 2.5% of funds raised
      profitCommission: 5.0,   // 5% of profit
    };
  }

  async updateCommissionSettings(updateCommissionDto: UpdateCommissionDto) {
    // In a real application, this would update a configuration table
    // For now, we'll just return the updated settings
    return {
      message: 'Commission settings updated successfully',
      settings: updateCommissionDto,
    };
  }

  async getProjectInvestors(projectId: string) {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    const investors = await this.prisma.investment.findMany({
      where: { projectId },
      include: {
        investor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return {
      project: {
        id: project.id,
        title: project.title,
        amountRequested: project.amountRequested,
        amountRaised: project.amountRaised,
        status: project.status,
      },
      investors,
    };
  }

  async getPlatformMetrics() {
    const [
      monthlyUsers,
      monthlyProjects,
      monthlyInvestments,
      monthlyRevenue,
    ] = await Promise.all([
      this.prisma.user.groupBy({
        by: ['createdAt'],
        where: {
          createdAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          },
        },
        _count: { id: true },
      }),
      this.prisma.project.groupBy({
        by: ['createdAt'],
        where: {
          createdAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          },
        },
        _count: { id: true },
      }),
      this.prisma.investment.groupBy({
        by: ['createdAt'],
        where: {
          createdAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          },
        },
        _sum: { amount: true },
      }),
      this.prisma.commission.groupBy({
        by: ['createdAt'],
        where: {
          createdAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          },
        },
        _sum: { amount: true },
      }),
    ]);

    return {
      monthlyUsers: monthlyUsers.length,
      monthlyProjects: monthlyProjects.length,
      monthlyInvestments: monthlyInvestments.reduce((sum, item) => sum + Number(item._sum.amount || 0), 0),
      monthlyRevenue: monthlyRevenue.reduce((sum, item) => sum + Number(item._sum.amount || 0), 0),
    };
  }
}