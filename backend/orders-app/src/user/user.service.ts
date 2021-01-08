import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from 'src/services/prisma.service';

@Injectable()
export class UserService {
    constructor(
        private prisma: PrismaService
    ) { }


    async getUserByName(name: string): Promise<User | undefined> {
        
        return await this.prisma.user.findUnique({
            where: {
                name
            }
        });
    }

    async addNewUser(data: Prisma.UserCreateInput) {
        return this.prisma.user.create({ data });
    }
}