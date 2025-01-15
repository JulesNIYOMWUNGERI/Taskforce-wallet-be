import { Module } from '@nestjs/common';
import { AccountsController } from './accounts.controller';
import { AccountsService } from './accounts.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from './entities/account.entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Account]),
    UsersModule
  ],
  controllers: [AccountsController],
  providers: [AccountsService],
  exports: [TypeOrmModule]
})
export class AccountsModule {}
