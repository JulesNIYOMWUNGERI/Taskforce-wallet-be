import { ForbiddenException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import { Transaction } from './entities/transaction.entity';
import { GetReportDto, TransactionDto, UpdateTransactionDto } from './dto/transaction.dto';
import { Account } from '../accounts/entities/account.entity';
import { Category } from '../categories/entities/category.entity';
import PdfPrinter from 'pdfmake';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { TDocumentDefinitions } from 'pdfmake/interfaces';

// import * as pdfMake from 'pdfmake';
// import * as path from 'path';

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





    async generatePdfReport(getReportDto: GetReportDto, userId: string): Promise<Buffer> {
        const { 
            startDate, 
            endDate, 
        } = getReportDto;

        const queryBuilder = this.transactionRepository
          .createQueryBuilder('transaction')
          .leftJoin('transaction.account', 'account')
          .leftJoin('transaction.category', 'category')
          .leftJoin('transaction.user', 'user')
          .where('user.id = :userId', { userId })
          .select([
            'transaction.id',
            'transaction.type',
            'transaction.amount',
            'transaction.transactionDate',
            'account.name AS accountName',
            'category.name AS categoryName'
          ]);
    
        if (startDate) {
          queryBuilder.andWhere('transaction.transactionDate >= :startDate', { startDate });
        }
        if (endDate) {
          queryBuilder.andWhere('transaction.transactionDate <= :endDate', { endDate });
        }

        const transactions = await queryBuilder.getRawMany();
    

        let totalIncome = 0;
        let totalExpenses = 0;

        transactions.forEach((t) => {
          const amount = typeof t.transaction_amount === 'number' ? t.transaction_amount : parseFloat(t.transaction_amount) || 0;
          if (t.transaction_type === 'income') {
            totalIncome += amount;
          } else if (t.transaction_type === 'expense') {
            totalExpenses += amount;
          }
        });

        const balance = totalIncome - totalExpenses;

        const documentDefinition: TDocumentDefinitions = {
          content: [
            { text: 'Transaction Report', style: 'header' },
            { text: `Date Range: ${startDate || 'N/A'} to ${endDate || 'N/A'}`, margin: [0, 10, 0, 10] },
            { text: `Total Income: ${totalIncome.toFixed(2) || 'N/A'}`, bold: true },
            { text: `Total Expenses: ${totalExpenses.toFixed(2) || 'N/A'}`, bold: true },
            { text: `Balance: ${balance.toFixed(2) || 'N/A'}`, bold: true },
            { text: '\n' },
            { text: 'Transactions:', style: 'subheader' },
            {
              table: {
                headerRows: 1,
                widths: ['*', '*', '*', '*', '*'],
                body: [
                  ['Date', 'Type', 'Amount', 'Account', 'Category'], // Header row
                  ...transactions.map((t) => [
                    t.transaction_transactionDate.toISOString().split('T')[0],
                    t.transaction_type,
                    typeof t.transaction_amount === 'number' ? t.transaction_amount.toFixed(2) : parseFloat(t.transaction_amount).toFixed(2),
                    t.accountname || 'N/A',
                    t.categoryname || 'N/A',
                  ]),
                ],
              },
            },
          ],
          styles: {
            header: {
              fontSize: 18,
              bold: true,
            },
            subheader: {
              fontSize: 14,
              bold: true,
            },
          },
        };
    
        // Create the PDF
        const fonts = {
          Roboto: {
            normal: 'Helvetica',
            bold: 'Helvetica-Bold',
            italic: 'Helvetica-Oblique',
            bolditalic: 'Helvetica-BoldItalic',
          },
        };
        const printer = new PdfPrinter(fonts);
    
        const pdfDoc = printer.createPdfKitDocument(documentDefinition);
        const chunks: Buffer[] = [];
    
        return new Promise((resolve, reject) => {
          pdfDoc.on('data', (chunk) => chunks.push(chunk));
          pdfDoc.on('end', () => resolve(Buffer.concat(chunks)));
          pdfDoc.on('error', (error) => reject(error));
          pdfDoc.end();
        });
    }
    
}
