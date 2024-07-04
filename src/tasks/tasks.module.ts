import { forwardRef, Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TaskRepository } from '../repositories/task.repository';
import { Task, TaskSchema } from '../schemas/tasks.schema';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { QueueModule } from 'src/queue/queue.module';
import { RabbitMqService } from 'src/services/rabbit-mq/rabbit-mq.service';
import { SqsService } from 'src/services/sqs/sqs.service';

@Global()
@Module({
    imports: [
        MongooseModule.forFeature([{ name: Task.name, schema: TaskSchema }]),
        QueueModule.register(),
    ],
    providers: [
        TaskRepository, 
        TasksService
    ],
    controllers: [TasksController],
    exports: [TasksService]
})
export class TasksModule {}
