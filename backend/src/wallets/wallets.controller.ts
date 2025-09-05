import { Controller, Get, Post, Body, Query, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { WalletsService } from './wallets.service';
import { DepositDto, WithdrawDto, TransactionQueryDto } from './dto/wallet.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Wallets')
@Controller('wallets')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class WalletsController {
  constructor(private walletsService: WalletsService) {}

  @Get()
  @ApiOperation({ summary: 'Get user wallet' })
  @ApiResponse({ status: 200, description: 'Wallet retrieved successfully' })
  async getWallet(@Request() req) {
    return this.walletsService.getWallet(req.user.id);
  }

  @Get('balance')
  @ApiOperation({ summary: 'Get wallet balance' })
  @ApiResponse({ status: 200, description: 'Balance retrieved successfully' })
  async getBalance(@Request() req) {
    return this.walletsService.getWalletBalance(req.user.id);
  }

  @Post('deposit')
  @ApiOperation({ summary: 'Deposit money to wallet' })
  @ApiResponse({ status: 201, description: 'Deposit successful' })
  @ApiResponse({ status: 400, description: 'Invalid amount' })
  async deposit(@Request() req, @Body() depositDto: DepositDto) {
    return this.walletsService.deposit(req.user.id, depositDto);
  }

  @Post('withdraw')
  @ApiOperation({ summary: 'Withdraw money from wallet' })
  @ApiResponse({ status: 201, description: 'Withdrawal successful' })
  @ApiResponse({ status: 400, description: 'Invalid amount or insufficient balance' })
  async withdraw(@Request() req, @Body() withdrawDto: WithdrawDto) {
    return this.walletsService.withdraw(req.user.id, withdrawDto);
  }

  @Get('transactions')
  @ApiOperation({ summary: 'Get wallet transactions' })
  @ApiResponse({ status: 200, description: 'Transactions retrieved successfully' })
  async getTransactions(@Request() req, @Query() query: TransactionQueryDto) {
    return this.walletsService.getTransactions(req.user.id, query);
  }

  @Get('transactions/:id')
  @ApiOperation({ summary: 'Get transaction by ID' })
  @ApiResponse({ status: 200, description: 'Transaction retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Transaction not found' })
  async getTransaction(@Request() req, @Param('id') id: string) {
    return this.walletsService.getTransactionById(req.user.id, id);
  }
}