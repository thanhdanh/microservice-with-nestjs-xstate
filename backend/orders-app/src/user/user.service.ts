import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from 'src/services/prisma.service';

@Injectable()
export class UserService {
    constructor(
        private prisma: PrismaService,
    ) { }


    async getUserByName(name: string): Promise<User | undefined> {
        return await this.prisma.user.findUnique({
            where: {
                name
            }
        });
    }

    async addNewUser(data: Prisma.UserCreateInput) {
        const userSameName = await this.getUserByName(data.name);
        if (userSameName) {
            throw new HttpException({
                status: HttpStatus.BAD_REQUEST,
                error: 'Duplicate username',
              }, HttpStatus.BAD_REQUEST);
        }

        const newUser = await this.prisma.user.create({ data })
        return newUser;
    }

    async getAllUsers() {
        return this.prisma.user.findMany()
    }
}