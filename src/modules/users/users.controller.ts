import { Body, Controller, Get, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { AuthService } from '../auth/auth.service';
import { SetBudgetDto, UserDto } from './dto/user.dto';
import { User } from './entities/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { AuthUser } from 'src/common/decorators/auth-user.decorator';
import { JwtClaimsDataDto } from 'src/common/dtos/jwt-data.dto';

@ApiTags('USERS')
@Controller('users')
export class UsersController {
    constructor(
        private readonly usersService: UsersService,
        private readonly authService: AuthService,
    ) {}

    @Post('/signup')
    @ApiResponse({
        status: 201,
        description: 'The user has been successfully created.',
    })
    @ApiResponse({ status: 400, description: 'Invalid data input.' })
    async create(@Body() createUserDto: UserDto): Promise<{ message: string; user: Omit<User, 'password'> }> {
        const user = await this.usersService.createUser(createUserDto);

        return {
            message: 'The user has been successfully created.',
            user,
        };
    }

    @Get()
    @ApiResponse({ status: 200, description: 'List of all users.' })
    async findAll(): Promise<Omit<User, 'password'>[]> {
        return await this.usersService.findAll();
    }

    // GET, user budget limit
    @ApiBearerAuth('JWT-auth')
    @UseGuards(AuthGuard('jwt'))
    @Get('/user-budget')
    @ApiResponse({ status: 200, description: 'List of all users.' })
    async getUserBudgetLimit(
        @AuthUser() authUser: JwtClaimsDataDto,
    ): Promise<{budgetLimit: number}> {
        const { sub } = authUser;
        return await this.usersService.findBudgetLimit(sub);
    }

    // POST, set budget limit
    @ApiBearerAuth('JWT-auth')
    @UseGuards(AuthGuard('jwt'))
    @Patch('/set_budget')
    @ApiResponse({
        status: 200,
        description: 'Budget set successful',
    })
    @ApiResponse({ status: 400, description: 'Invalid data input.' })
    async setUserBudgetLimit(
        @Body() setBudgetDto: SetBudgetDto,
        @AuthUser() authUser: JwtClaimsDataDto,
    ): Promise<{message: string}> {
        const { sub } = authUser;
        await this.usersService.setBudgetLimit(sub, setBudgetDto);

        return {
            message: "Budget set successful"
        }
    }
}
