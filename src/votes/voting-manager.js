const db = require('../db/redis');
const Vote = require('./vote');
const Namespace = require('./namespace');
class VotingManager {
    constructor(){
    }
    async init (){
        await this.clearCondidates();
        await this.addCondidates();
    }
    async clearCondidates(){
        console.log('cleaning votes');
        await db.removeAllCondidates();
    }
    async addCondidates(){
        console.log('adding condidates');
        await db.addAllCondidates();
    }
    async getCondidate(ns){
        let condidate  =  await db.getCondidate(ns);
        return new Vote(condidate);
    }
    async createNameSpaceForAllCondidates(io){
        this.io = this.io||io;
        let tables = await db.getAllTablesNameSpace();
        for (const ns of tables) {
            new Namespace('/'+ns, this.io, this);
        }
    }
    async initAction(req, ns) {
        let  vote  = await this.getCondidate(ns.replace('/',''));
        return { type: 'initAction', data: vote.conf };
    }
    async getProfile(req) {
        return { type: 'getProfile', data: await db.getUserByToken(req.token) };
    }
}
module.exports = new VotingManager();