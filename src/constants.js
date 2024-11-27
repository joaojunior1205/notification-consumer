require('dotenv').config();

const RABBIT_URL = `amqp://${process.env.RABBITMQ_USER}:${process.env.RABBITMQ_PASSWORD}@${process.env.RABBITMQ_HOST}:${process.env.RABBITMQ_PORT}/${process.env.RABBITMQ_VHOST}`;
const QUEUE = process.env.RABBITMQ_QUEUE || "push-notification";
const EXCHANGE = process.env.RABBITMQ_EXCHANGE || "amq.direct";
const PREFETCH = Number(process.env.RABBITMQ_PREFETCH) || 10;

const NOTIFICATION_COLLECTION_NAME = process.env.NOTIFICATION_COLLECTION_NAME || "users-notification-developer"; // PROD = users-notification-production

module.exports = {
    RABBIT_URL,
    QUEUE,
    EXCHANGE,
    PREFETCH,
    NOTIFICATION_COLLECTION_NAME
}