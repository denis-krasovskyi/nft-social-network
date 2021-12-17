import { Body, Controller, Request, Patch } from '@nestjs/common';
import { UserDto } from './dto/update.user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Patch(':id')
  update(@Request() req, @Body() updateUserDto: Partial<UserDto>) {
    return this.userService.update(req.user.userId, updateUserDto);
  }
}
