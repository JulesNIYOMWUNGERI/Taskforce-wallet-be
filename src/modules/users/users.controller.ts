import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { AuthService } from '../auth/auth.service';
import { UserDto } from './dto/user.dto';
import { User } from './entities/user.entity';

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
}
