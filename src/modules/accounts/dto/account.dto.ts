import { ApiProperty, PartialType } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class AccountDto {
  @ApiProperty({
    example: 'Bank Account',
    description: 'The name of the account',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 200000,
    description: 'The balance of the account',
  })
  @IsNumber()
  @IsNotEmpty()
  balance: number;

  @ApiProperty({
    example: 'Bank',
    description: 'The type of the account',
  })
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiProperty({
    example: 'RWF',
    description: 'The currency of the account',
  })
  @IsString()
  @IsNotEmpty()
  currency: string;
}


export class UpdateAccountDto extends PartialType(AccountDto) {
    @ApiProperty({
      example: 'Bank Account',
      description: 'The updated name of the account',
      required: false,
    })
    @IsString()
    @IsOptional()
    name?: string;
  
    @ApiProperty({
      example: 1000,
      description: 'The updated balance of the account',
      required: false,
    })
    @IsNumber()
    @IsOptional()
    balance?: number;
  
    @ApiProperty({
      example: 'Mobile Money',
      description: 'The updated type of the account',
      required: false,
    })
    @IsString()
    @IsOptional()
    type?: string;
  
    @ApiProperty({
      example: 'USD',
      description: 'The updated currency of the account',
      required: false,
    })
    @IsString()
    @IsOptional()
    currency?: string;
}