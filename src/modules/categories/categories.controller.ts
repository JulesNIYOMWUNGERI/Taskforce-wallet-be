import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { AuthUser } from 'src/common/decorators/auth-user.decorator';
import { Category } from './entities/category.entity';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto';
import { JwtClaimsDataDto } from 'src/common/dtos/jwt-data.dto';

@Controller('categories')
export class CategoriesController {
    constructor(
        private readonly categoriesService: CategoriesService,
    ) {}

    // POST, create category
    @ApiBearerAuth('JWT-auth')
    @UseGuards(AuthGuard('jwt'))
    @Post()
    @ApiResponse({
        status: 201,
        description: 'Category created',
    })
    @ApiResponse({ status: 400, description: 'Invalid data input.' })
    async createCategory(
        @Body() createCategoryDto: CreateCategoryDto,
        @AuthUser() authUser: JwtClaimsDataDto,
    ): Promise<Omit<Category, 'user'>> {
        const { sub } = authUser;
        return await this.categoriesService.createCategory(createCategoryDto, sub);
    }

    // GET, list all categories
    @ApiBearerAuth('JWT-auth')
    @UseGuards(AuthGuard('jwt'))
    @Get()
    @ApiResponse({ status: 200, description: 'List of all categories.' })
    async findAll(
        @AuthUser() authUser: JwtClaimsDataDto
    ): Promise<Category[]> {
        const { sub } = authUser;
        return await this.categoriesService.getAllCategories(sub);
    }

    // GET, get category by id
    @ApiBearerAuth('JWT-auth')
    @UseGuards(AuthGuard('jwt'))
    @Get('/:id')
    @ApiResponse({ status: 200, description: 'Category details.' })
    async findOne(
        @Param('id') id: string,
        @AuthUser() authUser: JwtClaimsDataDto,
    ): Promise<Category> {
        const { sub } = authUser;
        return await this.categoriesService.getCategoryById(id, sub);
    }

    // PUT, update category by id
    @ApiBearerAuth('JWT-auth')
    @UseGuards(AuthGuard('jwt'))
    @Put('/:id')
    @ApiResponse({ status: 200, description: 'Category updated.' })
    async update(
        @Param('id') id: string,
        @Body() updateCategoryDto: UpdateCategoryDto,
        @AuthUser() authUser: JwtClaimsDataDto,
    ): Promise<Omit<Category, 'user'>> {
        const { sub } = authUser;
        return await this.categoriesService.updateCategory(id, updateCategoryDto, sub);
    }

    // DELETE, delete category by id
    @ApiBearerAuth('JWT-auth')
    @UseGuards(AuthGuard('jwt'))
    @Delete('/:id')
    @ApiResponse({ status: 200, description: 'Category deleted.' })
    async remove(
        @Param('id') id: string,
        @AuthUser() authUser: JwtClaimsDataDto,
    ): Promise<void> {
        const { sub } = authUser;
        return await this.categoriesService.deleteCategory(id, sub);
    }
}
