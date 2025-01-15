import { ForbiddenException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import { Transaction } from './entities/transaction.entity';
import { TransactionDto, UpdateTransactionDto } from './dto/transaction.dto';
import { Account } from '../accounts/entities/account.entity';
import { Category } from '../categories/entities/category.entity';

@Injectable()
export class TransactionsService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,

        @InjectRepository(Account)
        private readonly accountRepository: Repository<Account>,

        @InjectRepository(Category)
        private readonly categoryRepository: Repository<Category>,
    
        @InjectRepository(Transaction)
        private readonly transactionRepository: Repository<Transaction>,
    ) {}

    async createTransaction(createTransactionDto: TransactionDto, userId: string, accountId: string, categoryId: string): Promise<Omit<Transaction, 'user'>> {
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

        const account = await this.accountRepository.findOne({
            where: { id: accountId },
            relations: ['user'],
        });

        if (!account) {
            throw new NotFoundException({
                statusCode: HttpStatus.NOT_FOUND,
                message: 'Account with the given ID does not exist',
                details: { accountId },
            });
        }

        if (account.user.id !== userId) {
            throw new ForbiddenException({
                statusCode: HttpStatus.FORBIDDEN,
                message: 'You are not the owner of the selected account',
                details: { accountId, userId },
            });
        }

        const category = await this.categoryRepository.findOneBy({
            id: categoryId
        });

        if (!category) {
            throw new NotFoundException({
                statusCode: HttpStatus.NOT_FOUND,
                message: 'Category with the given ID does not exist',
                details: { categoryId },
            });
        }

        const transaction = this.transactionRepository.create({
            ...createTransactionDto,
            account,
            category,
            user,
            type: createTransactionDto.type as "income" | "expense",
        });

        const savedTransaction = await this.transactionRepository.save(transaction);

        const { user: transactionUser, ...transactionWithoutUser } = savedTransaction;

        return transactionWithoutUser;
    }

    async findAll(userId: string): Promise<Transaction[]> {
        return this.transactionRepository.find({
          where: { user: { id: userId } },
          relations: ['account', 'category'],
        });
    }

    async findOne(userId: string, transactionId: string): Promise<Transaction> {
        const transaction = await this.transactionRepository.findOne({
          where: { id: transactionId, user: { id: userId } },
          relations: ['account', 'category', 'user'],
          select: {
            user: {
                id: true,
                fullName: true,
                email: true,
            }
          },
        });
    
        if (!transaction) {
          throw new NotFoundException({
            statusCode: HttpStatus.NOT_FOUND,
            message: 'Transaction not found',
            details: { transactionId, userId },
          });
        }
    
        return transaction;
    }

    async updateTransaction(
        userId: string,
        transactionId: string,
        updateTransactionDto: UpdateTransactionDto,
    ): Promise<Omit<Transaction, 'user'>> {
        const transaction = await this.transactionRepository.findOne({
            where: {id: transactionId},
            relations: ['user'],
        });

        if (!transaction) {
            throw new NotFoundException({
              statusCode: HttpStatus.NOT_FOUND,
              message: 'Transaction not found',
              details: { transactionId, userId },
            });
        }
    
        if (transaction.user.id !== userId) {
          throw new ForbiddenException({
            statusCode: HttpStatus.FORBIDDEN,
            message: 'You are not authorized to update this transaction',
            details: { transactionId, userId },
          });
        }

        const updatedTransaction = this.transactionRepository.merge(transaction, {
            ...updateTransactionDto,
            type: updateTransactionDto.type as "income" | "expense",
        });

        const savedTransaction = await this.transactionRepository.save(updatedTransaction);

        const { user: transactionUser, ...transactionWithoutUser } = savedTransaction;
    
        return transactionWithoutUser;
    }

    async deleteTransaction(userId: string, transactionId: string): Promise<void> {
        const transaction = await this.transactionRepository.findOne({
            where: {id: transactionId},
            relations: ['user'],
        });

        if (!transaction) {
            throw new NotFoundException({
              statusCode: HttpStatus.NOT_FOUND,
              message: 'Transaction not found',
              details: { transactionId, userId },
            });
        }
    
        if (transaction.user.id !== userId) {
          throw new ForbiddenException({
            statusCode: HttpStatus.FORBIDDEN,
            message: 'You are not authorized to delete this transaction',
            details: { transactionId, userId },
          });
        }
    
        await this.transactionRepository.remove(transaction);
    }
}
