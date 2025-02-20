import { Controller, Get, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { ReqWithPayloadType } from 'src/common/interfaces/payload.interface';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll() {
    return await this.usersService.findAll();
  }

  @Get('/me')
  async findOneById(@Req() req: ReqWithPayloadType) {
    return await this.usersService.findOneById(req.user.sub);
  }
}
