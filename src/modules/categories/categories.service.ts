import { ForbiddenException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto';

@Injectable()
export class CategoriesService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,

        @InjectRepository(Category)
        private categoryRepository: Repository<Category>,
    ) {}

    async createCategory(createCategoryDto: CreateCategoryDto, userId: string): Promise<Omit<Category, 'user'>> {
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

        const existingCategory = await this.categoryRepository.findOne({
            where: { 
                name: createCategoryDto.name,
                user: {
                    id: userId
                },
            },
        });
        
        if (existingCategory) {
            throw new ForbiddenException({
                statusCode: HttpStatus.FORBIDDEN,
                message: 'You already have a category with given name',
                details: {
                    name: createCategoryDto.name,
                },
            });
        }

        // If parentId exists, find the parent category
        let parentCategory: Category | null = null;
        if (createCategoryDto.parentId) {
            parentCategory = await this.categoryRepository.findOne({
                where: { id: createCategoryDto.parentId },
                relations: ['subcategories'],
            });

            if (!parentCategory) {
                throw new NotFoundException({
                    statusCode: HttpStatus.NOT_FOUND,
                    message: 'Parent category not found',
                    details: { parentId: createCategoryDto.parentId },
                });
            }
        }

        const category = this.categoryRepository.create({
            ...createCategoryDto,
            user,
            parent: parentCategory,
        });

        const savedCategory = await this.categoryRepository.save(category);
        
        const { user: categoryUser, ...categoryWithoutUser } = savedCategory;


        return categoryWithoutUser;
    }

    async getAllCategories(userId: string): Promise<Category[]> {
        const user = await this.userRepository.findOneBy({ id: userId });
    
        if (!user) {
          throw new NotFoundException({
            statusCode: HttpStatus.NOT_FOUND,
            message: 'User not found',
            details: { userId },
          });
        }
    
        return this.categoryRepository.find({
          where: { user: { id: userId } },
          relations: ['parent', 'subcategories'],
        });
    }

    async getCategoryById(categoryId: string, userId: string): Promise<Category> {
        const user = await this.userRepository.findOneBy({ id: userId });
    
        if (!user) {
          throw new NotFoundException({
            statusCode: HttpStatus.NOT_FOUND,
            message: 'User not found',
            details: { userId },
          });
        }
    
        const category = await this.categoryRepository.findOne({
          where: { id: categoryId, user: { id: userId } },
          relations: ['parent', 'subcategories', 'user'],
          select: {
            user: {
                id: true,
                fullName: true,
                email: true,
            }
          },
        });
    
        if (!category) {
          throw new NotFoundException({
            statusCode: HttpStatus.NOT_FOUND,
            message: 'Category not found',
            details: { categoryId },
          });
        }
    
        return category;
    }

    async updateCategory(categoryId: string, updateCategoryDto: UpdateCategoryDto, userId: string): Promise<Omit<Category, 'user'>> {
        const user = await this.userRepository.findOneBy({ id: userId });
    
        if (!user) {
          throw new NotFoundException({
            statusCode: HttpStatus.NOT_FOUND,
            message: 'User not found',
            details: { userId },
          });
        }
    
        const category = await this.categoryRepository.findOne({
          where: { id: categoryId, user: { id: userId } },
          relations: ['parent'],
        });
    
        if (!category) {
          throw new NotFoundException({
            statusCode: HttpStatus.NOT_FOUND,
            message: 'Category not found',
            details: { categoryId },
          });
        }
    
        if (updateCategoryDto.parentId) {
          const parentCategory = await this.categoryRepository.findOne({
            where: { id: updateCategoryDto.parentId },
          });
    
          if (!parentCategory) {
            throw new NotFoundException({
              statusCode: HttpStatus.NOT_FOUND,
              message: 'Parent category not found',
              details: { parentId: updateCategoryDto.parentId },
            });
          }
    
          category.parent = parentCategory;
        }
    
        category.name = updateCategoryDto.name || category.name;

        const savedCategory = await this.categoryRepository.save(category);
        
        const { user: categoryUser, ...categoryWithoutUser } = savedCategory;
    
        return categoryWithoutUser;
    }

    async deleteCategory(categoryId: string, userId: string): Promise<void> {
        const user = await this.userRepository.findOneBy({ id: userId });
    
        if (!user) {
          throw new NotFoundException({
            statusCode: HttpStatus.NOT_FOUND,
            message: 'User not found',
            details: { userId },
          });
        }
    
        const category = await this.categoryRepository.findOne({
          where: { id: categoryId, user: { id: userId } },
        });
    
        if (!category) {
          throw new NotFoundException({
            statusCode: HttpStatus.NOT_FOUND,
            message: 'Category not found',
            details: { categoryId },
          });
        }
    
        await this.categoryRepository.remove(category);
    }
}
