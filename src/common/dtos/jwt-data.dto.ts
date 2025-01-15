import { IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

export class JwtClaimsDataDto {
  @IsUUID()
  @IsNotEmpty()
  sub: string;

  @IsOptional()
  email: string;
}
