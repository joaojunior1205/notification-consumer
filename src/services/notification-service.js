const {getUserFirebase, sendMultiCastNotification} = require("../firebase");

const processNotification = (message) => {
    const messageContent = message.content.toString();
    const messageObject = JSON.parse(messageContent);

    if (!messageObject?.user_id) {
        throw `user_id is required`;
    }

    return messageObject
}

const sendSimpleMessage = async (messageObject) => {
    if (!messageObject?.user_id || !messageObject?.title || !messageObject.description) {
        const propertyInvalid = !messageObject?.user_id ? 'user_id' : !messageObject?.title ? 'title' : 'description';
        throw `property required is invalid ${propertyInvalid}`;
    }

    const getUser = await getUserFirebase(messageObject.user_id);

    if (!getUser?.device_tokens?.length) {
        throw `user not found or not found tokens to user ${messageObject?.user_id}`
    }

    const tokens = getUser.device_tokens;
    const {title, description} = messageObject;

    const message = {
        tokens: tokens,
        notification: {title: title, body: description},
        android: {priority: 'high'},
        apns: {
            payload: {
                aps: {priority: 10}
            }
        }
    };

    return sendMultiCastNotification(tokens, message, messageObject?.user_id);
}


module.exports = {
    processNotification,
    sendSimpleMessage
}