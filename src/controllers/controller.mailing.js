const { Router } = require('express');
const nodemailer = require('nodemailer');
//import __dirname from '../utils/
const emailNotifications = require('../utils/sendMail');
const MailDto = require('../DTO/mail.dto');
const usersService = require('../services/service.users');


const emailNotifier = new emailNotifications();
const router  = Router();

router.get('/:to', async (req, res) => {
    const email = req.params.to;
    let user = await usersService.getUserByEmail(email)

     //// Enviar mail
     const emailStructure = {
        from: 'kennyjosue8@gmail.com',
        to: email,
        subject:'Envío de mail con nodemailer.',
        html:`
        <div>
            <h1>Bienvenido ${user.name}</h1>
            <br>
            <h3></h3>

            <img src="cid:meme"/>
        </div>
    `,
        attachments: [{
            filename: 'meme.jpg',
            path: __dirname + '/public/images/totoro.jpg',
            cid: 'meme'
        }]
      }

      const emailStructures = new MailDto(emailStructure);
      const mail = await emailNotifier.sendMail(emailStructures.from, emailStructures.to, emailStructures.subject, emailStructures.html);


    res.send({status:"success", result: "Email enviado"})
});


module.exports = router;