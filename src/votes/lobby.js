const Namespace = require('./namespace');
const db = require('../db/redis');
const votingManager = require('./voting-manager');
const {Emitter} = require('@socket.io/redis-emitter');
const ioredis = require('ioredis');
const server = require('../config/server');
const voteConf = require('../config/vote');
/**
 * Lobby class to  mange lobby for the users
 */
class Lobby {
    constructor(id, io) {
        this.channel = new Namespace(id, io, this);
        this.emitter = new Emitter(new ioredis(server.REDIS.PORT,server.REDIS.HOST),{},id);
    }
    sendToAll(msg) {
        this.emitter.emit('request', msg)
    }
    async getProfile(req) {
        return { type: 'getProfile', data: await db.getUserByToken(req.token) };
    }
    async getCondidates(req) {
        return { type: 'getCondidates', data: await db.getAllCondidates(req.token) };
    }
    async giveVote(req) {
        let voter = await db.getUserByToken(req.token);
        let vote = null;
        try {
            vote = await votingManager.getCondidate(req.ns);
        } catch (error) {
            console.log(error)
            return { type: 'error', error: 'condidate not found' };
        }
        await db.updateVote(vote);
        vote.sendToAll({ type: 'initAction', data: vote.conf });
        this.sendToAll({ type: 'tableUpdate', data: vote.conf });
        return { type: 'giveVote', data: { ns: req.ns } };
    }

}
module.exports = Lobby;