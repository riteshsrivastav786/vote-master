//Initialize server
const http = require('http');
const express = require('express');
const { Server } = require("socket.io");
const { createAdapter } = require("@socket.io/redis-adapter");
const ioredis = require('ioredis');
const conf = require('./src/config/server');
const user = require('./src/routes/user');
const VoteServer = require('./src/votes/voteserver');
const app = express()
const server = http.createServer(app);
const io = new Server(server);
io.adapter(createAdapter(new ioredis(conf.REDIS.PORT,conf.REDIS.HOST), new ioredis(conf.REDIS.PORT,conf.REDIS.HOST)));
const voteserver = new VoteServer(io);
voteserver.init().then();
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use('/user',user);

app.use('/', express.static('public'))

server.listen(conf.PORT, () => {
  console.log(`Vote master is running at http://localhost:${conf.PORT}`);
})