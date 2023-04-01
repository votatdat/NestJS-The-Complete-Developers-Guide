import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { UsersService } from './users.service';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signup(email: string, password: string) {
    // Check if email existed
    const users = await this.usersService.find(email);
    if (users?.length) throw new BadRequestException('Email in use!');
    // Hash password
    const salt = randomBytes(8).toString('hex');
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    const result = salt + '.' + hash.toString('hex');
    // Create user and return the user
    return await this.usersService.create(email, result);
  }

  async signin(email: string, password: string) {
    const [user] = await this.usersService.find(email);
    if (!user) throw new NotFoundException('User not found!');

    const [salt, hashedPassword] = user.password?.split('.');
    const hash = (await scrypt(password, salt, 32)) as Buffer;

    if (hashedPassword !== hash.toString('hex'))
      throw new BadRequestException('Wrong password!');

    return user;
  }
}
