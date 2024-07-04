import { Module, DynamicModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config'
import { RabbitMqService } from '../services/rabbit-mq/rabbit-mq.service';
import { SqsService } from '../services/sqs/sqs.service';
import { TasksService } from 'src/tasks/tasks.service';
import { TaskRepository } from 'src/repositories/task.repository';

@Module({
    imports: [ConfigModule]
})
export class QueueModule {
    static register(): DynamicModule {
        return {
            module: QueueModule,
            providers: [
                {
                    provide: 'QUEUE_SERVICE',
                    useFactory: (configService: ConfigService) => {
                        if (configService.get('QUEUE_PROVIDER') === 'sqs') {
                            return new SqsService();
                        } else {
                            return new RabbitMqService();
                        }
                    },
                    inject: [ConfigService]
                }
            ],
            exports: ['QUEUE_SERVICE']
        }
    }
}
