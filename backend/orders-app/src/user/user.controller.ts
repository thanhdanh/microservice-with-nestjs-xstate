import { Body, Controller, Get, Post } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { from, Observable } from 'rxjs';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post()
    async create(@Body() payload: Prisma.UserCreateInput) {
        return await this.userService.addNewUser(payload);
    }

    @Get()
    list(): Observable<User[]> {
        return from(this.userService.getAllUsers());
    }
}