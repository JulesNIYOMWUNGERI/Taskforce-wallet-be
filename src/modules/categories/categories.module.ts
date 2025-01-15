import { Module } from '@nestjs/common';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Category]),
    UsersModule
  ],
  controllers: [CategoriesController],
  providers: [CategoriesService],
  exports: [TypeOrmModule]
})
export class CategoriesModule {}
