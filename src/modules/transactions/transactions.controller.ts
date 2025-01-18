import { Body, Controller, Delete, Get, Param, Post, Put, Query, Res, UseGuards } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { GetReportDto, TransactionDto, UpdateTransactionDto } from './dto/transaction.dto';
import { JwtClaimsDataDto } from 'src/common/dtos/jwt-data.dto';
import { AuthUser } from 'src/common/decorators/auth-user.decorator';
import { Transaction } from './entities/transaction.entity';
import { Response } from 'express';

@Controller('transactions')
export class TransactionsController {
    constructor(
        private readonly transactionsService: TransactionsService,
    ) {}


    // POST, create transaction
    @ApiBearerAuth('JWT-auth')
    @UseGuards(AuthGuard('jwt'))
    @Post('/:accountId/:categoryId')
    @ApiResponse({
        status: 201,
        description: 'Transaction created',
    })
    @ApiResponse({ status: 400, description: 'Invalid data input.' })
    async createTransaction(
        @Param('accountId') accountId: string,
        @Param('categoryId') categoryId: string,
        @Body() createTransactionDto: TransactionDto,
        @AuthUser() authUser: JwtClaimsDataDto,
    ): Promise<{message: string, transaction: Omit<Transaction, 'user'>}> {
        const { sub } = authUser;
        const transaction = await this.transactionsService.createTransaction(createTransactionDto, sub, accountId, categoryId);

        return {
            message: "Transaction created successful",
            transaction
        }
    }

    // GET, list all transactions
    @ApiBearerAuth('JWT-auth')
    @UseGuards(AuthGuard('jwt'))
    @Get()
    @ApiResponse({ status: 200, description: 'List of all transactions.' })
    async findAll(
        @AuthUser() authUser: JwtClaimsDataDto
    ): Promise<Transaction[]> {
        const { sub } = authUser;
        return await this.transactionsService.findAll(sub);
    }

    // GET, get transaction by id
    @ApiBearerAuth('JWT-auth')
    @UseGuards(AuthGuard('jwt'))
    @Get('/:id')
    @ApiResponse({ status: 200, description: 'Transaction details.' })
    async findOne(
        @Param('id') id: string,
        @AuthUser() authUser: JwtClaimsDataDto,
    ): Promise<Transaction> {
        const { sub } = authUser;
        return await this.transactionsService.findOne(sub, id);
    }

    // PUT, update transaction by id
    @ApiBearerAuth('JWT-auth')
    @UseGuards(AuthGuard('jwt'))
    @Put('/:id')
    @ApiResponse({ status: 200, description: 'Transaction updated.' })
    async update(
        @Param('id') id: string,
        @Body() updateTransactionDto: UpdateTransactionDto,
        @AuthUser() authUser: JwtClaimsDataDto,
    ): Promise<{message: string, res: Omit<Transaction, 'user'>}> {
        const { sub } = authUser;
        const res = await this.transactionsService.updateTransaction(sub, id, updateTransactionDto);
        
        return {
            message: "Transaction updated successful",
            res
        }
    }

    // DELETE, delete transaction by id
    @ApiBearerAuth('JWT-auth')
    @UseGuards(AuthGuard('jwt'))
    @Delete('/:id')
    @ApiResponse({ status: 200, description: 'Transaction deleted.' })
    async remove(
        @Param('id') id: string,
        @AuthUser() authUser: JwtClaimsDataDto,
    ): Promise<{message: string, res: void}> {
        const { sub } = authUser;
        const res = await this.transactionsService.deleteTransaction(sub, id);

        return {
            message: "Transaction deleted successful",
            res
        }
    }

    // GET, generate report
    @ApiBearerAuth('JWT-auth')
    @UseGuards(AuthGuard('jwt'))
    @Get('report/pdf')
    async getPdfReport(
      @Query() getReportDto: GetReportDto,
      @AuthUser() authUser: JwtClaimsDataDto,
      @Res() res: Response,
    ) {
        const { sub } = authUser;
        const pdfBuffer = await this.transactionsService.generatePdfReport(getReportDto, sub);

        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename=transaction-report.pdf`,
            'Content-Length': pdfBuffer.length,
        });

        res.end(pdfBuffer);
    }
}
