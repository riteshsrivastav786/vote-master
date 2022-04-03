const router = require('express').Router();
const crypto = require('crypto');
const db  = require('../db/redis');
// route to join the lobby will insert data in redis
router.post('/join',async (req, res)=>{
    console.log(req.body);
    let hash = crypto.createHash('md5').update(req.body.username).digest('hex');
    res.cookie('token',hash)
    await db.saveUser(req.body.username, hash);
    res.send({
        status: 'success',
        token: hash
    });
});


module.exports = router