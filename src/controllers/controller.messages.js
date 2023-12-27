const { Router } = require('express');
const Messages = require('../DAOs/dbManagers/MessagesDao.js');
const { isUser } = require('../middleware/authorization.js');
const passportCall = require('../utils/passport-call');

const message = new Messages();
const router  = Router();
router.get('/', passportCall('jwt'), isUser, async (req,res)=>{
    res.render('messages.handlebars');
})

router.post('/', async (req,res)=>{
    const item = req.body;
    const mess =  await message.post(item);
    req.logger.info(`Mensaje: ${mess}`);
    res.send({status:"success",payload:mess})
})
module.exports= router;