import { HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) {}

    async validateUser(email: string, password: string): Promise<any> {
        const user = await this.usersService.findByEmail(email);

        if (user && await bcrypt.compare(password, user.password)) {
            const { password, ...result } = user;
            return result;
        }

        throw new UnauthorizedException({
            statusCode: HttpStatus.UNAUTHORIZED,
            message: 'Invalid email or password',
            errorCode: 'AUTHENTICATION_FAILED',
        });
    }

    async login(loginDto: LoginDto) {
        const user = await this.validateUser(loginDto.email, loginDto.password);
        const payload = { email: user.email, sub: user.id };

        const access_token = this.jwtService.sign(payload);
        return {
          access_token,
          userInfo: {
            id: user.id,
            name: user.fullName,
            email: user.email,
          },
        };
    }
}
