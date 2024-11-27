const firebase = require("firebase/app");
const admin = require('firebase-admin');

const {NOTIFICATION_COLLECTION_NAME} = require("./constants");
const {FIREBASE_CONFIG, FIREBASE_CERT} = require("./infra/firebase-config");
const logger = require("../logger");

let firestore, messaging;

const initializeFirebaseConnection = () => {
    firebase.initializeApp(FIREBASE_CONFIG);

    admin.initializeApp({
        credential: admin.credential.cert(FIREBASE_CERT),
        databaseURL: "https://bufunfa-45d09.firebaseio.com"
    });

    firestore = admin.firestore();
    messaging = admin.messaging();
}

const getUserFirebase = async (userId) => {
    const collection = await firestore.collection(NOTIFICATION_COLLECTION_NAME).where('user_id', '==', userId).get();

    if (collection?.docs?.length) {
        return collection.docs[0].data();
    }

    return null;
}

const updateTokens = async (userId, newTokens) => {
    const collection = await firestore.collection(NOTIFICATION_COLLECTION_NAME).where('user_id', '==', userId).get();

    if (!collection?.empty) {
        const docId = collection.docs[0].id;
        await firestore.collection(NOTIFICATION_COLLECTION_NAME).doc(docId).update({device_tokens: newTokens});
    }
}

const sendMultiCastNotification = async (tokens, message, userId) => {
    const sender = await messaging.sendEachForMulticast(message);

    const failedTokens = [];

    sender.responses.forEach((resp, index) => {
        if (resp.error) {
            failedTokens.push(tokens[index]);
        }
    });

    const validTokens = tokens.filter(token => !failedTokens.includes(token));

    logger.info(`[x] Sending ${validTokens.length} successfully.`);

    if (failedTokens.length > 0) {
        await updateTokens(userId, validTokens);
        logger.info(`[x] ${failedTokens.length} invalid tokens removed successfully.`);
    }

    return validTokens;
}

module.exports = {
    initializeFirebaseConnection,
    getUserFirebase,
    sendMultiCastNotification
}