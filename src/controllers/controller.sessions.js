const { Router } = require ("express");
const Users = require('../DAOs/models/mongo/user.model.js');
const userService = require('../services/service.users.js');
const {comparePassword } = require('../utils/bcrypt.js');
const passport = require('passport');
const { generateToken  } = require("../utils/jwt");
const passportCall = require('../utils/passport-call');
const CustomErrors = require("../handlers/errors/CustomErrors.js");
const TYPES_ERRORS = require("../handlers/errors/types.errors.js");
const { generateUserErrorInfo, userLoginErrorInfo } = require("../handlers/errors/info.js");
const MESSAGES_ERRORS = require("../handlers/errors/messages.errors.js");
const EnumErrors = require("../handlers/errors/EnumError.js");
const { v4: uuidv4 } = require('uuid');
const emailNotifications = require('../utils/sendMail.js');
const MailDto = require('../DTO/mail.dto.js');
const {getHashedPassword, isValidPassword} = require('../utils/bcrypt.js');
const emailNotifier = new emailNotifications();
const router = Router();

router.post('/register', passport.authenticate('register', {session: false, failureRedirect:'/failRegister'}), async (req, res) => {
    try {      
        return res.status(201).json({message: 'User ' + req.user.email + ' successfully registered'});
    } catch (error) {
        req.logger.error(error);
        res.status(500).json({status: 'error', error: 'Internal Server Error'})
    }

});

router.get('/failRegister', (req, res) => {
    res.json({status: 'error', error: 'Failed to register'});
});

router.post('/login', async (req, res) => {
   try {
        const {email, password} = req.body;
        const user = await Users.findOne({email});
        const emailUser = email.trim();

        
        if(user===null) {
            req.logger.debug('Invalid credentials.');
            req.logger.warning('Invalid credentials.');
            const err = new Error(`Bad request!`);
            err.code = 10001;
            
            //return res.status( 400 ).json({status: 'error', error: 'Invalid credentials'});
            /* CustomErrors.createError({
                name: TYPES_ERRORS.USER_LOGIN_ERROR,
                cause: userLoginErrorInfo(emailUser),
                message: MESSAGES_ERRORS.USER_LOGIN_MESSAGE,
                code: EnumErrors.LOGIN_ERROR
              })  */
            throw err;
        }
        if (!comparePassword(password, user.password)) {
            req.logger.warning('Invalid credentials.');
            return res.status( 400 ).json({status: 'error', error: 'Invalid credentials'});
             
           /*  CustomErrors.createError({
                name: TYPES_ERRORS.USER_LOGIN_ERROR,
                cause: userLoginErrorInfo(emailUser),
                message: MESSAGES_ERRORS.USER_LOGIN_MESSAGE,
                code: EnumErrors.LOGIN_ERROR
              })  */ 
        }
        if (!user.confirmed === true) {
            req.logger.info("User not enabled. Please confirm the email.")
            return res.status(400).json({ status: 'error', error: 'User not enabled. Please confirm the email.' });
        }
        const userId = user._id;
        req.user = {
            id:userId, 
            email:user.email, 
            name:user.name, 
            lastname:user.lastname, 
            role:user.role,
            picture:user.picture,
        };

        // Actualizar last_connection al iniciar y cerrar sesión
        const currentDate = new Date();
        await userService.findByIdAndUpdateDate(userId, { last_connection: currentDate });


        const token = generateToken(user._id)
        res
        .cookie('authCookie', token, { maxAge: 240000, httpOnly: true })
        .json({ status: 'success', payload: 'New session initialized' })

    } catch (err) {

        if (err.code===10001){
           /*  req.logger.warning('Invalid credentials. Please try again.');
            req.logger.debug('Invalid credentials. Please try again.'); */
            return res.status( 400 ).json({status: 'error', error: err.message });
        }
        req.logger.debug('Nivel debug');
        //res.status(500).json({status: 'error', error: 'Internal Server Error'})
    }
});

router.get('/faillogin', (req, res) => {
    res.json({status: 'error', error: 'Login failed'});
});

router.post('/logout', async (req, res) => {
        // Elimina el token JWT almacenado en el cliente (por ejemplo, borrando una cookie)
        // Actualizar last_connection al iniciar y cerrar sesión
        try {
            const userId = req.body.userId;
            // Actualiza el parámetro last_connection
            const updatedUser = await userService.findByIdAndUpdateDate(userId, { last_connection: new Date() });
            if (!updatedUser) {
                req.logger.info(updatedUser)
                return res.status(400).json({status: 'error', error: err.message });
            }
            // Elimina la cookie de autenticación (si es aplicable)
            res.clearCookie('authCookie');
            res.status(200).json({ message: 'Logout exitoso', user: updatedUser });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });



router.get('/github', passport.authenticate('github', {scope: ['user:email']}));

router.get('/githubcallback', passport.authenticate('github', {session: false, failureRedirect: '/login'}), async(req, res)=>{
    const user = req.user;
    if(req.user.confirmed===true) {
        const token = generateToken(user._id)
        res.cookie('authCookie', token, { maxAge: 240000, httpOnly: true });
        return res.redirect('/api/views/products');
    }
    return res.redirect('/api/views/login');
});

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/googlecallback', passport.authenticate('google', {session: false, failureRedirect: '/login' }), async (req, res) => {
    const user = req.user;
    if(req.user.confirmed===true) {
        const token = generateToken(user._id)
        res.cookie('authCookie', token, { maxAge: 240000, httpOnly: true });
        return res.redirect('/api/views/products');
    }
    return res.redirect('/api/views/login');
  });

  router.post('/confirmResetPassword', async (req, res) => {
    const { email} = req.body;
    console.log(email);
    if (!email) {
        req.logger.log('info', 'Reset password, valores incompletos.');
        return res.status(400).send({status: 'error', error: 'Valores incompletos.'});
    }
    //  Verificar password válido
    console.log(email);
    let existEmail = await Users.find({email: email});
    //console.log(existEmail);
    if(!existEmail.length){//---------------------------------------------------------------------Si el mail existe, envíamos el link
        req.logger.log('info', 'Reset password, el mail provisto no existe.');   
        return res.status(400).send({status: 'error', error: 'El mail no existe en nuestra base de datos.'});    
    }
    // Generar el código
    const code = uuidv4();
    // Generar token
    const token = generateToken({email, code});
    //console.log(token);
    //// Enviar mail
    const emailStructure = {
        from: "CoderTest",
        to: email,
        subject:"Cuenta de usuario registrado",
        html:`<div> 
                <div><p>Para cambiar la contraseña ingresa al siguiente enlace:</p></div>
                <br/>
                <a href="http://localhost:3000/api/users/passwordChanged/${ token }" target="_blank">Cambiar contraseña</a>
            </div>`
    
        }

    const emailStructures = new MailDto(emailStructure);
    const mail = await emailNotifier.sendMail(emailStructures.from, emailStructures.to, emailStructures.subject, emailStructures.html);
    ///////  
    req.logger.log('info', `Reset password. El link para el cambio de contraseña ha sido eviado al mail: ${email}`);
    return mail
});

router.post('/resetPassword', async (req, res) => {
    const { email, password} = req.body;
    console.log(email);
    if (!email || !password) {
        req.logger.log('info', 'Reset password, valores incompletos.');
        return res.status(400).send({status: 'error', error: 'Valores incompletos.'});
    }
    //  Verificar password válido
    let user = await Users.findOne({email: email});
    if(user){
        const passwordValidate = await isValidPassword(user, password);
        if(passwordValidate===true){
            req.logger.log('info', 'La password nueva coincide con la antigua, por favor intente con otra password distinta.');
            return res.status(400).send({status: 'error', error: 'La password debe ser distinta a la antigua.'});
        }
        user = await Users.updateOne(
            {email: email}, 
            {$set:{password:getHashedPassword(password)}}
        );
        req.logger.log('info', 'Contraseña actualizada.');
        //res.send({status:'Success', message:'Contraseña actualizada.'});
        //Redirección por cambiar password satisfactoriamente
        return res.redirect('/api/views/passwordChangedSuccesfully');
    }else{
        req.logger.log('info', 'Reset password, el mail provisto no existe.');
    };
    ///////  
});  

router.get('/current', passportCall('jwt'), (req,res)=>{
    const user = req.user;
    return res.json({ user: user});
});

module.exports = router;