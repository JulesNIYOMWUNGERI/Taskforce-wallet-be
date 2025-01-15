import { ApiProperty, PartialType } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";

export class CreateCategoryDto {
    @ApiProperty({
        description: 'The name of the category',
        example: 'Food & Beverages',
    })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({
        description: 'The ID of the parent category (if this is a subcategory)',
        example: '1a2b3c4d',
        required: false,
    })
    @IsUUID()
    @IsOptional()
    parentId?: string;
}

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {
    @ApiProperty({
        example: 'Transport',
        description: 'The updated name of the category',
        required: false,
    })
    @IsString()
    @IsOptional()
    name?: string;
    
    @ApiProperty({
        example: '1a2b3c4d1a2b3c4d1a2b3c4d',
        description: 'Updated ID of the parent category (if this is a subcategory)',
        required: false,
    })
    @IsUUID()
    @IsOptional()
    parentId?: string;
}