const { Emitter } = require('@socket.io/redis-emitter');
const ioredis = require('ioredis');
const db = require('../db/redis');
const server = require("../config/server");
const vote = require('../config/vote');
class Vote {
    constructor(conf) {
        this.conf = conf;
        this.emitter = new Emitter(new ioredis(server.REDIS.PORT, server.REDIS.HOST), {}, '/' + this.conf.ns);
    }
    sendToAll(msg) {
        this.emitter.emit('request', msg)
    }
}

module.exports = Vote;