import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, Min } from 'class-validator';
import { CreateUserBasicInfoDto } from 'src/common/dtos/basic-user-info.dto';

export class UserDto extends CreateUserBasicInfoDto {}

export class SetBudgetDto {
    @ApiProperty({
      example: 1000,
      description: 'The budget limit for the user/account',
    })
    @IsNumber()
    @IsNotEmpty()
    @Min(0, { message: 'Budget limit must be a positive number' })
    budgetLimit: number;
}