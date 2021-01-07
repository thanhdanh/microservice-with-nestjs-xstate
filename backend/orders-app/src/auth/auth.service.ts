import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { LoginDto } from './dto/login.dto';
import { IJwtPayload } from './constants';

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private readonly jwtService: JwtService,
    ) { }

    async validateUser(userName: string) {
        const user = await this.userService.getUserByName(userName);
        if (user) {
            const { createdAt, ...rest } = user;
            return rest;
        }
        return null;
    }

    async login(data: LoginDto) {
        const validateResult = await this.validateUser(data.username);
        if (!validateResult) {
            throw new UnauthorizedException();
        }

        const payload = { username: validateResult.name, sub: validateResult.id } as IJwtPayload;
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
}