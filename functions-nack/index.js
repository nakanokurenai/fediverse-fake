const functions = require('firebase-functions')
const sleep = () => new Promise(r => setTimeout(r, 1 * 1000))

exports.test = functions.pubsub.topic('t1-topic').onPublish((msg, context) => {
    console.dir(msg)
    console.dir(context)
    throw new Error('NACK?')
})
exports.test2 = functions.pubsub.topic('t2-topic').onPublish(async (msg, context) => {
    console.dir(msg)
    console.dir(context)
    await sleep()
    throw new Error('NACK??')
})
