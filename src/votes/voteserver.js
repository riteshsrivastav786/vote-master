const Lobby = require('./lobby');
const votingManager = require('./voting-manager');
class VoteServer {
    constructor(io){
        this.io = io
    }
    async init(){
        this.lobby = new Lobby('/lobby', this.io);
        await votingManager.init();
        await votingManager.createNameSpaceForAllCondidates(this.io)
    }
}
module.exports = VoteServer