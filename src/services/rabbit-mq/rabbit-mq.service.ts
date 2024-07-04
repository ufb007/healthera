import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { QueueService } from '../queue.service.interface';
import amqp, { ChannelWrapper } from 'amqp-connection-manager';
import { Channel, ConfirmChannel } from 'amqplib';

@Injectable()
export class RabbitMqService implements QueueService {
    private channelWrapper: ChannelWrapper;
    public queueName: string = 'taskQueue';

    constructor() {
        const connection = amqp.connect(process.env.RABBITMQ_ENDPOINT);
        this.channelWrapper = connection.createChannel({
            setup: (channel: Channel) => channel.assertQueue(this.queueName, { durable: true })
        });
    }

    public async publishMessage(message: string): Promise<void> {
        try {
            await this.channelWrapper.sendToQueue(this.queueName, Buffer.from(message));
            Logger.log('Message sent to queue', message);
        } catch (err) {
            throw new HttpException(
                'Error adding mail to queue',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    public async onModuleInit(): Promise<void> {
        try {
            await this.channelWrapper.addSetup(async (channel: ConfirmChannel) => {
                await channel.assertQueue(this.queueName, { durable: true });
                await channel.consume(this.queueName, (message) => {
                    if (message) {
                        const content = message.content.toString();
                        
                        Logger.log('Received message:', content);
                        channel.ack(message);
                        console.log('CONSUMING MESSAGE - ', content);
                    }
                });
            });
        } catch (err) {
            throw new Error(err);
        }
    }
}
