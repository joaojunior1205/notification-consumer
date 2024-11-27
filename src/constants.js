require('dotenv').config();

const user = encodeURIComponent(process.env.RABBITMQ_USER)
const password = encodeURIComponent(process.env.RABBITMQ_PASSWORD)
const host = encodeURIComponent(process.env.RABBITMQ_HOST)
const port = encodeURIComponent(process.env.RABBITMQ_PORT)
const vhost = encodeURIComponent(process.env.RABBITMQ_VHOST)
const queue = encodeURIComponent(process.env.RABBITMQ_QUEUE)
const exchange = encodeURIComponent(process.env.RABBITMQ_EXCHANGE)
const notificationCollectionName = encodeURIComponent(process.env.NOTIFICATION_COLLECTION_NAME)

const RABBIT_URL = `amqp://${user}:${password}@${host}:${port}/${vhost}`;
const QUEUE = queue || "push-notification";
const EXCHANGE = exchange || "amq.direct";
const PREFETCH = Number(process.env.RABBITMQ_PREFETCH) || 10;

const NOTIFICATION_COLLECTION_NAME = notificationCollectionName || "users-notification-developer"; // PROD = users-notification-production

module.exports = {
    RABBIT_URL,
    QUEUE,
    EXCHANGE,
    PREFETCH,
    NOTIFICATION_COLLECTION_NAME
}