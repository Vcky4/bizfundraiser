import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DepositDto, WithdrawDto, TransactionQueryDto } from './dto/wallet.dto';
import { TransactionType, TransactionStatus } from '@prisma/client';

@Injectable()
export class WalletsService {
  constructor(private prisma: PrismaService) {}

  async getWallet(userId: string) {
    const wallet = await this.prisma.wallet.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    if (!wallet) {
      throw new NotFoundException('Wallet not found');
    }

    return wallet;
  }

  async deposit(userId: string, depositDto: DepositDto) {
    const { amount, description } = depositDto;

    if (amount <= 0) {
      throw new BadRequestException('Amount must be greater than 0');
    }

    // In a real application, this would integrate with a payment gateway
    // For now, we'll simulate a successful deposit
    const reference = `DEP_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Start a transaction
    const result = await this.prisma.$transaction(async (tx) => {
      // Create transaction record
      const transaction = await tx.transaction.create({
        data: {
          userId,
          type: TransactionType.DEPOSIT,
          status: TransactionStatus.COMPLETED,
          amount,
          description: description || 'Wallet deposit',
          reference,
          completedAt: new Date(),
        },
      });

      // Update wallet balance
      const wallet = await tx.wallet.update({
        where: { userId },
        data: {
          balance: {
            increment: amount,
          },
        },
      });

      return { transaction, wallet };
    });

    return result;
  }

  async withdraw(userId: string, withdrawDto: WithdrawDto) {
    const { amount, description } = withdrawDto;

    if (amount <= 0) {
      throw new BadRequestException('Amount must be greater than 0');
    }

    // Check if user has sufficient balance
    const wallet = await this.prisma.wallet.findUnique({
      where: { userId },
    });

    if (!wallet) {
      throw new NotFoundException('Wallet not found');
    }

    if (wallet.balance < amount) {
      throw new BadRequestException('Insufficient balance');
    }

    // In a real application, this would integrate with a payment gateway
    // For now, we'll simulate a successful withdrawal
    const reference = `WTH_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Start a transaction
    const result = await this.prisma.$transaction(async (tx) => {
      // Create transaction record
      const transaction = await tx.transaction.create({
        data: {
          userId,
          type: TransactionType.WITHDRAWAL,
          status: TransactionStatus.COMPLETED,
          amount,
          description: description || 'Wallet withdrawal',
          reference,
          completedAt: new Date(),
        },
      });

      // Update wallet balance
      const updatedWallet = await tx.wallet.update({
        where: { userId },
        data: {
          balance: {
            decrement: amount,
          },
        },
      });

      return { transaction, wallet: updatedWallet };
    });

    return result;
  }

  async getTransactions(userId: string, query: TransactionQueryDto) {
    const { type, status, page = '1', limit = '10' } = query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const where: any = { userId };

    if (type) {
      where.type = type;
    }

    if (status) {
      where.status = status;
    }

    const [transactions, total] = await Promise.all([
      this.prisma.transaction.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limitNum,
      }),
      this.prisma.transaction.count({ where }),
    ]);

    return {
      transactions,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    };
  }

  async getTransactionById(userId: string, transactionId: string) {
    const transaction = await this.prisma.transaction.findFirst({
      where: {
        id: transactionId,
        userId,
      },
    });

    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    return transaction;
  }

  async getWalletBalance(userId: string) {
    const wallet = await this.prisma.wallet.findUnique({
      where: { userId },
      select: { balance: true },
    });

    if (!wallet) {
      throw new NotFoundException('Wallet not found');
    }

    return { balance: wallet.balance };
  }

  // Internal method for investment transactions
  async processInvestment(userId: string, amount: number, projectId: string, description?: string) {
    const wallet = await this.prisma.wallet.findUnique({
      where: { userId },
    });

    if (!wallet) {
      throw new NotFoundException('Wallet not found');
    }

    if (wallet.balance < amount) {
      throw new BadRequestException('Insufficient balance for investment');
    }

    const reference = `INV_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const result = await this.prisma.$transaction(async (tx) => {
      // Create investment transaction
      const transaction = await tx.transaction.create({
        data: {
          userId,
          type: TransactionType.INVESTMENT,
          status: TransactionStatus.COMPLETED,
          amount,
          description: description || `Investment in project ${projectId}`,
          reference,
          metadata: { projectId },
          completedAt: new Date(),
        },
      });

      // Update wallet balance
      const updatedWallet = await tx.wallet.update({
        where: { userId },
        data: {
          balance: {
            decrement: amount,
          },
        },
      });

      return { transaction, wallet: updatedWallet };
    });

    return result;
  }

  // Internal method for repayment transactions
  async processRepayment(userId: string, amount: number, projectId: string, description?: string) {
    const reference = `REP_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const result = await this.prisma.$transaction(async (tx) => {
      // Create repayment transaction
      const transaction = await tx.transaction.create({
        data: {
          userId,
          type: TransactionType.REPAYMENT,
          status: TransactionStatus.COMPLETED,
          amount,
          description: description || `Repayment from project ${projectId}`,
          reference,
          metadata: { projectId },
          completedAt: new Date(),
        },
      });

      // Update wallet balance
      const updatedWallet = await tx.wallet.update({
        where: { userId },
        data: {
          balance: {
            increment: amount,
          },
        },
      });

      return { transaction, wallet: updatedWallet };
    });

    return result;
  }
}