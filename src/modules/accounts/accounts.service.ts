import { ForbiddenException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import { Account } from './entities/account.entity';
import { AccountDto, UpdateAccountDto } from './dto/account.dto';

@Injectable()
export class AccountsService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,

        @InjectRepository(Account)
        private readonly accountRepository: Repository<Account>,
    ) {}

    async createAccount(createAccountDto: AccountDto, userId: string): Promise<Omit<Account, 'user'>> {
        const user = await this.userRepository.findOneBy({
            id: userId
        });

        if (!user) {
            throw new NotFoundException({
                statusCode: HttpStatus.NOT_FOUND,
                message: 'User not found',
                details: {
                    userId,
                },
            });
        }

        const existingAccount = await this.accountRepository.findOne({
            where: { 
                name: createAccountDto.name,
                user: {
                    id: userId
                },
            },
        });

        if (existingAccount) {
            throw new ForbiddenException({
                statusCode: HttpStatus.FORBIDDEN,
                message: 'You already have an account with given name',
                details: {
                    name: createAccountDto.name,
                },
            });
        }

        const account = this.accountRepository.create({
            ...createAccountDto,
            user,
        });

        const savedAccount = await this.accountRepository.save(account);

        const { user: accountUser, ...accountWithoutUser } = savedAccount;

        return accountWithoutUser;
    }

    async findAll(userId: string): Promise<Account[]> {
        return await this.accountRepository.find({
            where: {
                user: {
                    id: userId
                },
            },
            relations: ['user'],
            select: {
                user: {
                    id: true,
                    fullName: true,
                    email: true,
                }
            },
        });
    }

    async findOne(id: string, userId: string): Promise<Account> {
        const account = await this.accountRepository.findOne({
            where: {
                id,
                user: {
                    id: userId
                },
            },
            relations: ['user'],
            select: {
                user: {
                    id: true,
                    fullName: true,
                    email: true,
                }
            },
        });

        if (!account) {
            throw new NotFoundException({
                statusCode: HttpStatus.NOT_FOUND,
                message: 'Account not found',
                details: {
                    id,
                },
            });
        }

        return account;
    }

    async updateAccount(id: string, updateAccountDto: UpdateAccountDto, userId: string): Promise<Omit<Account, 'user'>> {
        const account = await this.accountRepository.findOne({
            where: { id },
            relations: ['user'],
        });

        if (!account) {
            throw new NotFoundException({
                statusCode: HttpStatus.NOT_FOUND,
                message: 'Account with the given ID does not exist',
                details: { id },
            });
        }

        if (account.user.id !== userId) {
            throw new ForbiddenException({
                statusCode: HttpStatus.FORBIDDEN,
                message: 'You are not the owner of this account',
                details: { id, userId },
            });
        }

        const updatedAccount = this.accountRepository.merge(account, updateAccountDto);

        const savedAccount = await this.accountRepository.save(updatedAccount);

        const { user: accountUser, ...accountWithoutUser } = savedAccount;

        return accountWithoutUser;
    }

    async removeAccount(id: string, userId: string): Promise<void> {
        const account = await this.accountRepository.findOne({
            where: { id },
            relations: ['user'],
        });

        if (!account) {
            throw new NotFoundException({
                statusCode: HttpStatus.NOT_FOUND,
                message: 'Account with the given ID does not exist',
                details: { id },
            });
        }

        if (account.user.id !== userId) {
            throw new ForbiddenException({
                statusCode: HttpStatus.FORBIDDEN,
                message: 'You are not the owner of this account',
                details: { id, userId },
            });
        }

        await this.accountRepository.remove(account);
    }
}
