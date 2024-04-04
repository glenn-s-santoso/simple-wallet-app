/* import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto'; */

import { HttpStatus, Injectable, HttpException } from '@nestjs/common';
import { PrismaService } from '@prismaSvc/prisma.service';
import { User, Prisma } from '@prisma/client';

import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  private user: Prisma.UserDelegate;
  constructor(private prisma: PrismaService) {
    this.user = prisma.user;
  }

  async findOne(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
  ): Promise<User | null> {
    const usr = await this.checkIfNotFound(userWhereUniqueInput);
    return usr;
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }): Promise<User[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.user.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async create(data: Prisma.UserCreateInput): Promise<User> {
    data.password = await bcrypt.hash(data.password, await bcrypt.genSalt());
    return this.user
      .create({
        data,
      })
      .catch((e) => {
        const str = e.meta.target[0];
        if (str == 'email' || str == 'username' || str == 'phone') {
          
          throw new HttpException(
            str[0].toUpperCase() +
            str.slice(1) +
              ' already exists!',
            HttpStatus.BAD_REQUEST,
          );
        }
        return e;
      });
  }

  async update(params: {
    where: Prisma.UserWhereUniqueInput;
    data: Prisma.UserUpdateInput;
  }): Promise<User> {
    const { where, data } = params;

    await this.checkIfNotFound(where);
    
    if (data.password) {
      data.password = await bcrypt.hash(data.password, await bcrypt.genSalt());
    }
    
    return this.user.update({
      data,
      where,
    });
  }

  async remove(where: Prisma.UserWhereUniqueInput): Promise<User> {
    await this.checkIfNotFound(where);

    return this.user.delete({
      where,
    });
  }

  async checkIfNotFound(userWhereUniqueInput) {
    console.log(userWhereUniqueInput);
    const usr = await this.user.findUnique({
      where: userWhereUniqueInput,
    });

    if (usr == undefined) {
      throw new HttpException(
        'User not found!',
        HttpStatus.NOT_FOUND,
      );
    }

    return usr;
  }
  /* create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  } */
}
