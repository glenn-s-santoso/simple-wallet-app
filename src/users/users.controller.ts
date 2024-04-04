import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /* @Post()
  async signupUser(
    @Body() userData: { name?: string, email: string, password: string},
  ): Promise<UserModel> {
    return this.userService.createUser(userData);
  } */
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll({});
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne({
      id: id,
    });
    // return this.usersService.findOne({
    //   id: id,
    // });
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update({
      where: {
        id: id
      },
      data: updateUserDto
    });
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove({
      id: id
    });
  }
}
