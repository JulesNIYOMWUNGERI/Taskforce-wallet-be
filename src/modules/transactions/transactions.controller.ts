import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { TransactionDto, UpdateTransactionDto } from './dto/transaction.dto';
import { JwtClaimsDataDto } from 'src/common/dtos/jwt-data.dto';
import { AuthUser } from 'src/common/decorators/auth-user.decorator';
import { Transaction } from './entities/transaction.entity';

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
    ): Promise<Omit<Transaction, 'user'>> {
        const { sub } = authUser;
        return await this.transactionsService.createTransaction(createTransactionDto, sub, accountId, categoryId);
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
    ): Promise<Omit<Transaction, 'user'>> {
        const { sub } = authUser;
        return await this.transactionsService.updateTransaction(sub, id, updateTransactionDto);
    }

    // DELETE, delete transaction by id
    @ApiBearerAuth('JWT-auth')
    @UseGuards(AuthGuard('jwt'))
    @Delete('/:id')
    @ApiResponse({ status: 200, description: 'Transaction deleted.' })
    async remove(
        @Param('id') id: string,
        @AuthUser() authUser: JwtClaimsDataDto,
    ): Promise<void> {
        const { sub } = authUser;
        return await this.transactionsService.deleteTransaction(sub, id);
    }
}
