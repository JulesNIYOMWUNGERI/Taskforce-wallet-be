import { ApiProperty } from '@nestjs/swagger';

export class CreateUserBasicInfoDto {
  @ApiProperty({ example: 'John Deo', description: 'Full name of the user.' })
  fullName: string;

  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'Email address of the user.',
  })
  email: string;

  @ApiProperty({
    example: 'Password123!',
    description: 'Password of the user.',
  })
  password: string;
}