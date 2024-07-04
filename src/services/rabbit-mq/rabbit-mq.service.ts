import { Injectable, Logger, HttpException, HttpStatus, Inject } from '@nestjs/common';
import { QueueService } from '../queue.service.interface';
import amqp, { ChannelWrapper } from 'amqp-connection-manager';
import { Channel, ConfirmChannel } from 'amqplib';
import { TasksService } from 'src/tasks/tasks.service';
import { TaskRepository } from 'src/repositories/task.repository';

@Injectable()
export class RabbitMqService implements QueueService {
    private channelWrapper: ChannelWrapper;
    public queueName: string = 'taskQueue';

    private tasksService: TasksService;

    /**
     * Initializes the RabbitMQ connection and creates a channel.
     *
     * @return {void} No return value.
     */
    constructor() {
        const connection = amqp.connect(process.env.RABBITMQ_ENDPOINT);
        this.channelWrapper = connection.createChannel({
            setup: (channel: Channel) => channel.assertQueue(this.queueName, { durable: true })
        });

        //const taskRepository: TaskRepository = new TaskRepository();

        this.tasksService = new TasksService(this);
    }

    /**
     * Publishes a message to the queue.
     *
     * @param {string} message - The message to be published.
     * @return {Promise<void>} A promise that resolves when the message is successfully published or an error occurs.
     */
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

    /**
     * A function that initializes the module and sets up the channel to consume messages.
     *
     * @return {Promise<void>} A promise that resolves when the setup is complete.
     */
    public async onModuleInit(): Promise<void> {
        try {
            await this.channelWrapper.addSetup(async (channel: ConfirmChannel) => {
                await channel.assertQueue(this.queueName, { durable: true });
                await channel.consume(this.queueName, (message) => {
                    if (message) {
                        const content = message.content.toString();

                        // Send data to task service to process
                        this.tasksService.create(JSON.parse(content));
                        
                        Logger.log('Received message:', content);
                        channel.ack(message);
                    }
                });
            });
        } catch (err) {
            throw new Error(err);
        }
    }
}
