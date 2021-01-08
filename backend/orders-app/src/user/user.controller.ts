import { Body, Controller, Post } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post()
    async create(@Body() payload: Prisma.UserCreateInput) {
        const user = await this.userService.addNewUser(payload);
        return user;
    }
}