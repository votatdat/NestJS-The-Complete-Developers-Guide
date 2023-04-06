import { Test } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';

import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './user.entity';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    const users: User[] = [];
    fakeUsersService = {
      find: (email: string) => {
        const filteredUsers = users?.filter((user) => user.email === email);
        return Promise.resolve(filteredUsers);
      },
      create: (email: string, password: string) => {
        const user = {
          id: Math.floor(Math.random() * 999),
          email,
          password,
        } as User;
        users.push(user);
        return Promise.resolve(user);
      },
    };

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  it('can create an instance of the auth service', async () => {
    expect(service).toBeDefined();
  });

  it('create a user with a salted and hashed password', async () => {
    const user = await service.signup('test@test.com', 'test');
    expect(user.password).not.toEqual('test');

    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('throw when user sign up with a used email', async () => {
    await service.signup('test@test.com', 'test');

    await expect(service.signup('test@test.com', 'test')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('throw when signing in with an un-registered email', async () => {
    await expect(service.signin('test@test.com', 'test')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('throw when signing in with a wrong password', async () => {
    await service.signup('test@test.com', 'test');

    await expect(service.signin('test@test.com', 'test2')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('return a user if signing with right password', async () => {
    await service.signup('test@test.com', 'test');

    const user = await service.signin('test@test.com', 'test');
    expect(user).toBeDefined();
  });
});
