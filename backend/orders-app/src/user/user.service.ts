import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { PrismaService } from 'src/services/prisma.service';

@Injectable()
export class UserService {
    constructor(
        private jwtService: JwtService,
        private prisma: PrismaService
    ) { }


    async getUserByName(name: string): Promise<User | undefined> {
        return await this.prisma.user.findUnique({
            where: {
                name
            }
        });
    }
}