import { Controller, Get, Param, Post } from '@nestjs/common';

@Controller('messages')
export class MessagesController {
  private id: string;
  @Get()
  listMessages() {
    console.log('listMessages');
  }

  @Post()
  createMessage() {
    console.log('createMessage');
  }

  @Get('/:id')
  getMessage() {
    console.log('getMessage');
  }
}
