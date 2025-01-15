import { ApiProperty, PartialType } from "@nestjs/swagger";
import { IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class TransactionDto {
    @ApiProperty({
        example: 2000,
        description: "The amount involved in the transaction",
    })
    @IsNumber()
    @IsNotEmpty()
    amount: number;

    @ApiProperty({
        example: "income",
        description: "The type of transaction (e.g., income, expense)",
    })
    @IsString()
    @IsNotEmpty()
    type: string;

    @ApiProperty({
        example: "Salary for January",
        description: "A brief description of the transaction",
    })
    @IsString()
    @IsNotEmpty()
    description: string;

    @ApiProperty({
        example: "2025-01-14T10:00:00.000Z",
        description: "The date of the transaction",
    })
    @IsDateString()
    @IsNotEmpty()
    transactionDate: string;
}

export class UpdateTransactionDto extends PartialType(TransactionDto) {
    @ApiProperty({
        example: 4000,
        description: 'The updated amount involved in the transaction',
        required: false,
    })
    @IsNumber()
    @IsOptional()
    amount?: number;
    
    @ApiProperty({
        example: "expense",
        description: "The updated type of transaction (e.g., income, expense)",
        required: false,
    })
    @IsString()
    @IsOptional()
    type?: string;
    
    @ApiProperty({
        example: 'Salary for February',
        description: "The updated brief description of the transaction",
        required: false,
    })
    @IsString()
    @IsOptional()
    description?: string;
    
    @ApiProperty({
        example: "2025-01-14T10:00:00.000Z",
        description: "The updated date of the transaction",
        required: false,
    })
    @IsDateString()
    @IsOptional()
    transactionDate?: string;
}
