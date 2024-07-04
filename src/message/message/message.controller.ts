import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { MessageService } from './message.service';
import { QueueService } from 'src/services/queue.service.interface';

@Controller('message')
export class MessageController {
    constructor(
        @Inject('QUEUE_SERVICE') 
        private readonly queueService: QueueService, 
        private readonly messageService: MessageService
    ) {}

    @Post('publish')
    public async publish(@Body('message') message: string) {
        try {
            await this.queueService.publishMessage(message);
            return { message: 'Message queued' };
        } catch (err) {
            throw new Error(err);
        }
    }
}
