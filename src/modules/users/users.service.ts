import { BadRequestException, ConflictException, HttpStatus, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { SetBudgetDto, UserDto } from './dto/user.dto';
import * as bcrypt from 'bcrypt'; 

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    async findAll(): Promise<Omit<User, 'password'>[]> {
        const users = await this.userRepository.find();

        const usersWithoutPassword = users.map((user) => {
          const { password, ...userWithoutPassword } = user;
          return userWithoutPassword;
        });

        return usersWithoutPassword;
    }

    async createUser(createUserDto: UserDto): Promise<Omit<User, 'password'>> {
        const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS, 10);

        const existingUser = await this.userRepository.findOne({
          where: { email: createUserDto.email },
        });
    
        if (existingUser) {
          throw new ConflictException({
            statusCode: HttpStatus.CONFLICT,
            message: 'Email already exists',
            details: {
              email: createUserDto.email,
            },
          });
        }
    
        if (createUserDto.password.length < 8) {
          throw new BadRequestException({
            statusCode: HttpStatus.BAD_REQUEST,
            message: 'Password must be at least 8 characters long',
            details: {
              value: createUserDto.password,
            },
          });
        }
    
        const hashedPassword = await bcrypt.hash(
          createUserDto.password,
          saltRounds,
        );
    
        const user = this.userRepository.create({
          ...createUserDto,
          password: hashedPassword,
        });

        const savedUser = await this.userRepository.save(user);

        const { password, ...userWithoutPassword } = savedUser;
    
          
        return userWithoutPassword;
    }

    async findByEmail(email: string): Promise<User> {
        const user = await this.userRepository.findOne({ where: { email } });
        if (!user) {
          throw new UnauthorizedException('User not found');
        }
        return user;
    }

    async findById(id: string): Promise<User> {
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) {
          throw new UnauthorizedException('User not found');
        }
        return user;
    }

    async setBudgetLimit(userId: string, setBudgetDto: SetBudgetDto): Promise<User> {
      const { budgetLimit } = setBudgetDto;
    
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) {
        throw new NotFoundException('User not found');
      }
    
      user.budgetLimit = budgetLimit;
      return this.userRepository.save(user);
    }

    async findBudgetLimit(userId: string): Promise<{budgetLimit: number}> {
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) {
        throw new NotFoundException('User not found');
      }

      const userBudgetLimit = {
        budgetLimit: user.budgetLimit
      };

      return userBudgetLimit;
  }
}
