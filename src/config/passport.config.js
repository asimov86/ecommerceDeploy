const passport = require('passport')
const local = require('passport-local')
const jwt = require('passport-jwt')
//const Users = require('../DAOs/models/mongo/user.model.js');
const Users = require('../services/service.users.js');
const Roles = require('../DAOs/models/mongo/role.model.js');
const Carts = require('../DAOs/dbManagers/CartsDao.js');
const { getHashedPassword, comparePassword } = require('../utils/bcrypt')
const {generateToken} = require('../utils/jwt')
const cookieExtractor = require('../utils/cookieExtractor')
//const MailingService = require('../services/mailing.js');
const emailNotifications = require('../utils/sendMail.js');
const GithubStrategy = require('passport-github2')
const GoogleStrategy = require('passport-google-oauth20');
const { v4: uuidv4 } = require('uuid');
const { CLIENTE_ID_GITHUB, CLIENT_SECRET_GITHUB, CLIENT_CALLBACK_GITHUB, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_CALLBACK_URL} = require('../public/js/config');
const UserDto = require('../DTO/user.dto.js');
const MailDto = require('../DTO/mail.dto.js');
const CustomErrors = require('../handlers/errors/CustomErrors.js');
const TYPES_ERRORS = require('../handlers/errors/types.errors.js');
const generateUserErrorInfo = require('../handlers/errors/info.js');
const MESSAGES_ERRORS = require('../handlers/errors/messages.errors.js');
const EnumErrors = require('../handlers/errors/EnumError.js');
const LocalStrategy = local.Strategy
const JWTStrategy = jwt.Strategy
const ExtractJwt = jwt.ExtractJwt

const cartManager = new Carts();
const emailNotifier = new emailNotifications();
const initilizePassport = () => {
  passport.use(
    'register', //nombre de la estrategia
    new LocalStrategy( // instancia de la clase
      { passReqToCallback: true, usernameField: 'email' }, async (req, username, password, done) => {
        const { name, lastname, email, age } = req.body;
        try {
          if(!name || !lastname || !email || !password || !age) {
            CustomErrors.createError({
              name: TYPES_ERRORS.USER_CREATION_ERROR,
              cause: generateUserErrorInfo({ name, lastname, email, age, password }),
              message: MESSAGES_ERRORS.USER_CREATION_MESSAGE,
              code: EnumErrors.INVALID_TYPES_ERROR
            })
          }
          const user = await Users.getUserByEmail(username);
          if (user) {
            //req.logger.info('Usuario ya existe')
            //return done(null, false)
            CustomErrors.createError({
              name: TYPES_ERRORS.USER_CREATION_ERROR,
              cause: generateUserErrorInfo(email),
              message: MESSAGES_ERRORS.USER_CREATION_MESSAGE,
              code: EnumErrors.USER_ALREADY_EXISTS_ERROR
            })
            
          }
          let newCart = await cartManager.createCart();
          let role='user';
          if (email === 'admincoder@coder.com' && password === 'adminCod3r123') {
              role = 'admin';
          }
          roleName = await Roles.findOne({roleName: role});
    
          const userRegister = {
            name,
            lastname,
            email,
            age,
            password: getHashedPassword(password),
            cart: newCart.toString(),
            role:roleName._id.toString(),
            last_connection: null
          }
          const userInfo = new UserDto(userRegister);
          const newUser = await Users.createUser(userInfo)
          const userId = newUser._id.toString();

          // Generar el código
          const uniqueCode = uuidv4();

          // Generar token
          const token = generateToken({userId, uniqueCode});


          //// Enviar mail
          const emailStructure = {
            from: "CoderTest",
            to: email,
            subject:"Cuenta de usuario registrado",
            html:`<div> 
                      <div>Felicidades has quedado registrado </div>
                      <p>Para confirmar tu cuenta, ingresa al siguiente enlace</p>
                  <a
                      href="http://localhost:3000/api/users/confirm/${ token }"
                      target="_blank"
                  >Confirmar Cuenta</a>
                  </div>`
          }

          const emailStructures = new MailDto(emailStructure);
          const mail = await emailNotifier.sendMail(emailStructures.from, emailStructures.to, emailStructures.subject, emailStructures.html);
          ////


          done(null, newUser)
        } catch (error) {
          done(`Error al crear el usuario: ${error}`)
        }
      }
    )
  )

  passport.use(
    'login', //nombre de la estrategia
    new LocalStrategy(
      { usernameField: 'email' }, async (username, password, done) => {
        try {
          const user = await Users.getUserByEmail(username)
          if (!user) {
            //req.logger.info("User doesn't exist")
            CustomErrors.createError({
              name: TYPES_ERRORS.USER_LOGIN_ERROR,
              cause: generateUserErrorInfo({email}),
              message: MESSAGES_ERRORS.USER_LOGIN_MESSAGE,
              code: EnumErrors.LOGIN_ERROR
            }) 
            return done(null, false)
          }

          if (!comparePassword(password, user.password)) {
            //return done(null, false)
            CustomErrors.createError({
              name: TYPES_ERRORS.USER_LOGIN_ERROR,
              cause: generateUserErrorInfo({email}),
              message: MESSAGES_ERRORS.USER_LOGIN_MESSAGE,
              code: EnumErrors.LOGIN_ERROR
            })
          }
          
          return done(null, user)
        } catch (error) {
          done(error)
        }
      }
    )
  )

passport.use(
    'github', //nombre de la estrategia
    new GithubStrategy(
      {
        clientID: CLIENTE_ID_GITHUB,
        clientSecret: CLIENT_SECRET_GITHUB,
        callbackURL: CLIENT_CALLBACK_GITHUB
      }, async (accessToken, refreshToken, profile, done) => {
        try {
          const user = await Users.getUserByEmail(profile._json.email)
          let role='user';
          if (profile._json.email === 'admincoder@coder.com') {
              role = 'admin';
          }
          roleName = await Roles.findOne({roleName: role});
          let newCart = await cartManager.createCart();
          if (!user) {
            const userRegister = {
              name: profile._json.name,
              lastname: '',
              email: profile._json.email,
              age: '',
              password: '',
              cart: newCart._id.toString(),
              role: roleName,
              picture: profile._json.avatar_url,
            }
            const userInfo = new UserDto(userRegister);
            const newUser = await Users.createUser(userInfo)
            const userId = newUser._id.toString();
              // Generar el código
            const uniqueCode = uuidv4();
            // Generar token
            const token = generateToken({userId, uniqueCode});
            //// Enviar mail
            const emailStructure = {
              from: "CoderTest",
              to: email,
              subject:"Cuenta de usuario registrado",
              html:`<div> 
                        <div>Felicidades has quedado registrado </div>
                        <p>Para confirmar tu cuenta, ingresa al siguiente enlace</p>
                    <a
                        href="http://localhost:3000/api/users/confirm/${ token }"
                        target="_blank"
                    >Confirmar Cuenta</a>
                    </div>`
            }

            const emailStructures = new MailDto(emailStructure);
            const mail = await emailNotifier.sendMail(emailStructures.from, emailStructures.to, emailStructures.subject, emailStructures.html);
            ////
            return done(null, newUser)
          }
          
          done(null, user)
        } catch (error) {
          done(null, error)
        }
      }
    )
  )


passport.use('google', new GoogleStrategy({
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: GOOGLE_CALLBACK_URL,
      scope: ['profile'],
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            const userEmail = profile.emails[0].value; 
            const user = await Users.getUserByEmail(userEmail)
            let role='user';
            if (profile._json.email === 'admincoder@coder.com') {
                role = 'admin';
            }
            roleName = await Roles.findOne({roleName: role});
            let newCart = await cartManager.createCart();
            if (!user) {
                const userRegister = {
                  name: profile._json.given_name,
                  lastname: profile._json.familiy_name,
                  email: userEmail,
                  age: '',
                  password: '',
                  cart: newCart._id.toString(),
                  role: roleName,
                  picture: profile._json.picture,
                }
                const userInfo = new UserDto(userRegister);
                const newUser = await Users.createUser(userInfo)
                const userId = newUser._id.toString();
                  // Generar el código
                const uniqueCode = uuidv4();

                // Generar token
                const token = generateToken({userId, uniqueCode});

                //// Enviar mail
                const emailStructure = {
                  from: "CoderTest",
                  to: email,
                  subject:"Cuenta de usuario registrado",
                  html:`<div> 
                            <div>Felicidades has quedado registrado </div>
                            <p>Para confirmar tu cuenta, ingresa al siguiente enlace</p>
                        <a
                            href="http://localhost:3000/api/users/confirm/${ token }"
                            target="_blank"
                        >Confirmar Cuenta</a>
                        </div>`
                }

                const emailStructures = new MailDto(emailStructure);
                const mail = await emailNotifier.sendMail(emailStructures.from, emailStructures.to, emailStructures.subject, emailStructures.html);
                ////
                return done(null, newUser)
            }
            done(null, user)
        } catch (error) {
            done(null, error)
        }
      
    }
  ));

passport.use(
    'jwt', //nombre de la estrategia
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
        secretOrKey: 'mySecret',
      }, async (jwt_payload, done) => {
        try {
          done(null, jwt_payload)
        } catch (error) {
          done(error)
        }
      }
    )
  )

  passport.serializeUser((user, done) => {
    done(null, user._id)
  })

  passport.deserializeUser(async (id, done) => {
    const user = await Users.getUserByID(id)
    done(null, user)
  })

}

module.exports = initilizePassport