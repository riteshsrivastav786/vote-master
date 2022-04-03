const ioredis = require('ioredis');
const voteConf = require('../config/vote')
const conf = require('../config/server');
//  Redis db Data manager
class Database {
    constructor() {
        this.db = new ioredis(conf.REDIS.PORT, conf.REDIS.HOST)
    }
    removeAllCondidates() {
        return this.db.del('votes');
    }
    addAllCondidates() {
        let votes = {};
        voteConf.VOTES.map((vote) => {
            votes[vote.ns] = JSON.stringify(vote);
        })
        return this.db.hset('votes', votes);
    }
    async getAllCondidates(token) {
        let publics = [];
        let votes = await this.db.hgetall('votes');
        for (const key in votes) {
            if (Object.hasOwnProperty.call(votes, key)) {
                const vote = JSON.parse(votes[key]);
                publics.push(vote);
            }
        }
        return { public: publics };
    }
    async getAllTablesNameSpace (){
        return Object.keys(await this.db.hgetall('votes'));
    }
    saveUser(username, token) {
        this.db.set(token, JSON.stringify({ username, token }));
    }
    async getUserByToken(token) {
        let user = await this.db.get(token);
        return JSON.parse(user);
    }
    async getCondidate(ns) {
        let condidate = await this.db.hget('votes', ns);
        if (condidate) {
            return JSON.parse(condidate);
        }
        return null;
    }
    async updateVote(vote) {
        vote.conf.voteCount = vote.conf.voteCount + 1;
        return await this.db.hset('votes', vote.conf.ns, JSON.stringify(vote.conf))
    }
}
module.exports = new Database();