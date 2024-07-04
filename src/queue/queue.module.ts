import { Module, DynamicModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config'
import { QueueService } from '../services/queue.service.interface';
import { RabbitMqService } from '../services/rabbit-mq/rabbit-mq.service';
import { SqsService } from '../services/sqs/sqs.service';

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
                        if (configService.get('QUEUE_PRIVDER')) {
                            return new RabbitMqService();
                        } else {
                            return new SqsService();
                        }
                    },
                    inject: [ConfigService]
                }
            ],
            exports: ['QUEUE_SERVICE']
        }
    }
}
