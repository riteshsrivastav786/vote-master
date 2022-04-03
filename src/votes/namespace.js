// socket io name space handler
class Namespace {
    constructor(id, io, handler) {
        this.id = id;
        this.handler = handler;
        io.of(id).on("connection", (socket) => {
            socket.on("request", this.onRequest.bind(this));
        });
    }
    async onRequest({ type, data }, reply) {
        try {
            if (this.handler[type]) {
                let result = await this.handler[type](data, this.id);
                reply(result);
            } else {
                reply({ type: 'error', error: type + '  method is not defined' })
            }
        } catch (error) {
            console.log(error)
            reply({ type: 'error', error: error.stack })
        }
    }
}
module.exports = Namespace;