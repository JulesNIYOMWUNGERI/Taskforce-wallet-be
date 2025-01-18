import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AccountsService } from './accounts.service';
import { AuthGuard } from '@nestjs/passport';
import { AccountDto, UpdateAccountDto } from './dto/account.dto';
import { AuthUser } from 'src/common/decorators/auth-user.decorator';
import { JwtClaimsDataDto } from 'src/common/dtos/jwt-data.dto';
import { Account } from './entities/account.entity';

@ApiTags('ACCOUNTS')
@Controller('accounts')
export class AccountsController {
    constructor(
        private readonly accountsService: AccountsService,
    ) {}

    // POST, create account
    @ApiBearerAuth('JWT-auth')
    @UseGuards(AuthGuard('jwt'))
    @Post()
    @ApiResponse({
        status: 201,
        description: 'Account created',
    })
    @ApiResponse({ status: 400, description: 'Invalid data input.' })
    async createAccount(
        @Body() createAccountDto: AccountDto,
        @AuthUser() authUser: JwtClaimsDataDto,
    ): Promise<{message: string, account: Omit<Account, 'user'>}> {
        const { sub } = authUser;
        const account = await this.accountsService.createAccount(createAccountDto, sub);

        return {
            message: "Account created successful",
            account
        }
    }

    // GET, list all accounts
    @ApiBearerAuth('JWT-auth')
    @UseGuards(AuthGuard('jwt'))
    @Get()
    @ApiResponse({ status: 200, description: 'List of all accounts.' })
    async findAll(
        @AuthUser() authUser: JwtClaimsDataDto
    ): Promise<Account[]> {
        const { sub } = authUser;
        return await this.accountsService.findAll(sub);
    }

    // GET, get account by id
    @ApiBearerAuth('JWT-auth')
    @UseGuards(AuthGuard('jwt'))
    @Get('/:id')
    @ApiResponse({ status: 200, description: 'Account details.' })
    async findOne(
        @Param('id') id: string,
        @AuthUser() authUser: JwtClaimsDataDto,
    ): Promise<Account> {
        const { sub } = authUser;
        return await this.accountsService.findOne(id, sub);
    }

    // PUT, update account by id
    @ApiBearerAuth('JWT-auth')
    @UseGuards(AuthGuard('jwt'))
    @Put('/:id')
    @ApiResponse({ status: 200, description: 'Account updated.' })
    async update(
        @Param('id') id: string,
        @Body() updateAccountDto: UpdateAccountDto,
        @AuthUser() authUser: JwtClaimsDataDto,
    ): Promise<{message: string, account: Omit<Account, 'user'>}> {
        const { sub } = authUser;
        const account = await this.accountsService.updateAccount(id, updateAccountDto, sub);

        return {
            message: "Account updated successful",
            account
        }
    }

    // DELETE, delete account by id
    @ApiBearerAuth('JWT-auth')
    @UseGuards(AuthGuard('jwt'))
    @Delete('/:id')
    @ApiResponse({ status: 200, description: 'Account deleted.' })
    async remove(
        @Param('id') id: string,
        @AuthUser() authUser: JwtClaimsDataDto,
    ): Promise<{message: string, res: void}> {
        const { sub } = authUser;
        const res = await this.accountsService.removeAccount(id, sub);

        return {
            message: "Account deleted successful",
            res
        }
    }
}
