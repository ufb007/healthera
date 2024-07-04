import { Module, DynamicModule, forwardRef } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config'
import { RabbitMqService } from '../services/rabbit-mq/rabbit-mq.service';
import { SqsService } from '../services/sqs/sqs.service';
import { TasksService } from 'src/tasks/tasks.service';

@Module({
    imports: [ConfigModule]
})
export class QueueModule {
    static register(): DynamicModule {
        return {
            module: QueueModule,
            providers: [
                SqsService,
                RabbitMqService,
                {
                    provide: 'QUEUE_SERVICE',
                    useFactory: (configService: ConfigService, tasksService: TasksService) => {
                        if (configService.get('QUEUE_PROVIDER') === 'sqs') {
                            return new SqsService(tasksService);
                        } else {
                            return new RabbitMqService(tasksService)
                        }
                    },
                    inject: [ConfigService]
                }
            ],
            exports: ['QUEUE_SERVICE']
        }
    }
}
