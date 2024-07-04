import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MessageController } from './message/message/message.controller';
import { MessageService } from './message/message/message.service';
import { MessageModule } from './message/message/message.module';
import { RabbitMqService } from './services/rabbit-mq/rabbit-mq.service';
import { SqsService } from './services/sqs/sqs.service';
import { QueueModule } from './queue/queue.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    MessageModule,
    ConfigModule.forRoot({ isGlobal: true }),
    QueueModule.register()
  ],
  controllers: [AppController, MessageController],
  providers: [
    AppService, 
    MessageService, 
    RabbitMqService, 
    SqsService
  ],
})
export class AppModule {}
