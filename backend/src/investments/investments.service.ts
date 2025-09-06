import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { WalletsService } from '../wallets/wallets.service';
import { CreateInvestmentDto, InvestmentQueryDto } from './dto/investment.dto';
import { ProjectStatus, UserRole, TransactionType } from '@prisma/client';

@Injectable()
export class InvestmentsService {
  constructor(
    private prisma: PrismaService,
    private walletsService: WalletsService,
  ) {}

  async createInvestment(userId: string, createInvestmentDto: CreateInvestmentDto) {
    const { projectId, amount } = createInvestmentDto;

    // Check if user exists and is an investor
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.role !== UserRole.INVESTOR) {
      throw new ForbiddenException('Only investors can make investments');
    }

    if (!user.kycCompleted) {
      throw new ForbiddenException('KYC must be completed before making investments');
    }

    // Check if project exists and is approved
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    if (project.status !== ProjectStatus.APPROVED) {
      throw new BadRequestException('Project must be approved before investments can be made');
    }

    if (!project.isActive) {
      throw new BadRequestException('Project is not active');
    }

    // Check if project is fully funded
    if (project.amountRaised >= project.amountRequested) {
      throw new BadRequestException('Project is already fully funded');
    }

    // Check if user has already invested in this project
    const existingInvestment = await this.prisma.investment.findUnique({
      where: {
        investorId_projectId: {
          investorId: userId,
          projectId: projectId,
        },
      },
    });

    if (existingInvestment) {
      throw new BadRequestException('You have already invested in this project');
    }

    // Calculate expected return
    const expectedReturn = (amount * project.expectedROI) / 100;

    // Process investment
    const result = await this.prisma.$transaction(async (tx) => {
      // Create investment record
      const investment = await tx.investment.create({
        data: {
          investorId: userId,
          projectId: projectId,
          amount,
          expectedReturn,
        },
        include: {
          investor: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
          project: {
            select: {
              id: true,
              title: true,
              business: {
                select: {
                  businessName: true,
                },
              },
            },
          },
        },
      });

      // Update project amount raised
      const updatedProject = await tx.project.update({
        where: { id: projectId },
        data: {
          amountRaised: {
            increment: amount,
          },
        },
      });

      // Check if project is now fully funded
      if (updatedProject.amountRaised >= updatedProject.amountRequested) {
        await tx.project.update({
          where: { id: projectId },
          data: {
            status: ProjectStatus.FUNDED,
            fundedAt: new Date(),
          },
        });
      }

      return investment;
    });

    // Process wallet transaction
    await this.walletsService.processInvestment(
      userId,
      amount,
      projectId,
      `Investment in ${project.title}`,
    );

    return result;
  }

  async getInvestments(userId: string, query: InvestmentQueryDto) {
    const { projectId, status, page = '1', limit = '10' } = query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const where: any = { investorId: userId };

    if (projectId) {
      where.projectId = projectId;
    }

    if (status) {
      where.isActive = status === 'active';
    }

    const [investments, total] = await Promise.all([
      this.prisma.investment.findMany({
        where,
        include: {
          project: {
            select: {
              id: true,
              title: true,
              description: true,
              amountRequested: true,
              amountRaised: true,
              duration: true,
              expectedROI: true,
              status: true,
              fundedAt: true,
              repaidAt: true,
              business: {
                select: {
                  businessName: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limitNum,
      }),
      this.prisma.investment.count({ where }),
    ]);

    return {
      investments,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    };
  }

  async getInvestmentById(userId: string, investmentId: string) {
    const investment = await this.prisma.investment.findFirst({
      where: {
        id: investmentId,
        investorId: userId,
      },
      include: {
        project: {
          include: {
            business: {
              select: {
                businessName: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
    });

    if (!investment) {
      throw new NotFoundException('Investment not found');
    }

    return investment;
  }

  async getInvestmentStats(userId: string) {
    const [
      totalInvestments,
      activeInvestments,
      totalInvested,
      totalExpectedReturn,
      totalActualReturn,
    ] = await Promise.all([
      this.prisma.investment.count({
        where: { investorId: userId },
      }),
      this.prisma.investment.count({
        where: { investorId: userId, isActive: true },
      }),
      this.prisma.investment.aggregate({
        where: { investorId: userId },
        _sum: { amount: true },
      }),
      this.prisma.investment.aggregate({
        where: { investorId: userId },
        _sum: { expectedReturn: true },
      }),
      this.prisma.investment.aggregate({
        where: { investorId: userId },
        _sum: { actualReturn: true },
      }),
    ]);

    return {
      totalInvestments,
      activeInvestments,
      totalInvested: totalInvested._sum.amount || 0,
      totalExpectedReturn: totalExpectedReturn._sum.expectedReturn || 0,
      totalActualReturn: totalActualReturn._sum.actualReturn || 0,
    };
  }

  async processRepayment(projectId: string, totalRepayment: number) {
    // Get all active investments for this project
    const investments = await this.prisma.investment.findMany({
      where: {
        projectId,
        isActive: true,
      },
      include: {
        investor: true,
        project: {
          select: {
            title: true,
          },
        },
      },
    });

    if (investments.length === 0) {
      return;
    }

    // Calculate total invested amount
    const totalInvested = investments.reduce((sum, inv) => sum + Number(inv.amount), 0);

    // Process repayments for each investor
    for (const investment of investments) {
      const investorShare = (Number(investment.amount) / totalInvested) * totalRepayment;
      const actualReturn = investorShare - Number(investment.amount);

      await this.prisma.$transaction(async (tx) => {
        // Update investment with actual return
        await tx.investment.update({
          where: { id: investment.id },
          data: {
            actualReturn,
            repaidAt: new Date(),
            isActive: false,
          }
        });

        // Process wallet repayment
        await this.walletsService.processRepayment(
          investment.investorId,
          investorShare,
          projectId,
          `Repayment from ${investment.project?.title}`,
        );
      });
    }

    // Update project status
    await this.prisma.project.update({
      where: { id: projectId },
      data: {
        status: ProjectStatus.REPAID,
        repaidAt: new Date(),
      },
    });
  }

  async getAllInvestments(query: InvestmentQueryDto) {
    const { projectId, status, page = '1', limit = '10' } = query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const where: any = {};

    if (projectId) {
      where.projectId = projectId;
    }

    if (status) {
      where.isActive = status === 'active';
    }

    const [investments, total] = await Promise.all([
      this.prisma.investment.findMany({
        where,
        include: {
          investor: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          project: {
            select: {
              id: true,
              title: true,
              business: {
                select: {
                  businessName: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limitNum,
      }),
      this.prisma.investment.count({ where }),
    ]);

    return {
      investments,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    };
  }
}