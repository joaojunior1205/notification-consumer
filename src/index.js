require('dotenv').config();
const logger = require('../logger');
const amqp = require('amqplib/callback_api');
const {RABBIT_URL, QUEUE, EXCHANGE, PREFETCH} = require("./constants");
const {initializeFirebaseConnection} = require("./firebase");
const {processNotification, sendSimpleMessage} = require("./services/notification-service");

initializeFirebaseConnection();

amqp.connect(RABBIT_URL, (connErr, connection) => {
    if (connErr) {
        throw connErr;
    }

    connection.createChannel(function (channelErr, channel) {
        if (channelErr) {
            throw channelErr;
        }

        channel.on("error", function (err) {
            logger.error(`[AMQP] channel error: ${err.message}`);
            process.exit(0);
        });

        channel.on("close", function () {
            logger.error("[AMQP] channel closed");
            process.exit(0);
        });

        channel.assertQueue(QUEUE, {
            durable: true,
        });

        channel.assertExchange(EXCHANGE, 'direct', {
            durable: true,
        });

        channel.bindQueue(QUEUE, EXCHANGE, '');

        logger.info(`[*] Waiting for messages in exchange: '${EXCHANGE}' --- queue: '${QUEUE}'... CTRL+C to exit!`);

        channel.prefetch(PREFETCH);

        channel.consume(QUEUE, async function (msg) {
            try {
                const processMessage = processNotification(msg);

                if (!processMessage) {
                    return new Error('Process message failed.');
                }

                await sendSimpleMessage(processMessage);

                channel.ack(msg);
            } catch (err) {
                logger.error(`[AMQP] channel error: ${err?.message || JSON.stringify(err)}`);
                channel.reject(msg, false);
            }
        }, {noAck: false});
    })
});