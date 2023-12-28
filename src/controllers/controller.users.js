const {Router} = require('express');
const jwt = require('../utils/jwt');
const { getTokenData} = require('../utils/jwt')
const usersService = require('../services/service.users.js');
const rolesService = require('../services/service.roles.js');
const {upload} = require('../utils/multer.js');
const router = Router();

router.get('/mockuser', async (req, res) => {
    try {
        const {numUsers=1} = req.query;
        const users = generateUsers(numUsers);
        return res.json({payload: users});
    } catch (error) {
        req.logger.info(error)
        return res.status(500).json({status:'error', error: error})
    }
});

router.get('/create', (req, res) => {
    try {
        res.render('register.handlebars')
    } catch (error) {
        req.logger.info(error)
        return res.json({ error: error})
    }
    
}) 

router.get('/', async (req, res) => {
    try {
        const users = await usersService.getUsers();
        res.json({messages: users});
    } catch (error) {
        req.logger.info(error)
        return res.json({ error: error})
    }
}) 

router.get('/:uid', async (req, res) => {
    try {
        const uid = req.params.uid;
        const user = await usersService.getUserByID(uid);
        return res.json({messages: user});
    } catch (error) {
        req.logger.info(error)
        return res.json({ error: error})
    }
    
}) 

router.get('/confirm/:token', async (req, res) => {
    try {
        const authToken = req.params.token;
        //const id = req.user.userId;
        const confirmUser = await usersService.confirmToken(authToken);
        res.json({message: 'Usuario confirmado.'});
    // Acá podría verificar el campo modifiedCount para confirmar si fue modificado el campo "confirmed" en el usuario creado.
    } catch (error) {
        req.logger.info('The user could not be confirmed.');
        return res.status(500).json({status:'error', error: error})
    }
    
});

router.get('/passwordChanged/:token', async (req, res) => {
    try {
        //obtener token
        const { token} = req.params;
        let data = await getTokenData(token);
        //verificar la data
        if(data===null) {
          req.logger.log('error','Error al obtener data del token. Se redirigirá para volver a resetear la contraseña.');
          return res.redirect('/resetPassword');
        }
        // verificar si existe el usuario
        const { email, code } = data.user;
        let user = await usersService.getUserByEmail(email);
        if (!user) {
            return res.json({ 
                success: false,
                msg: 'Error al obtener data'
            });
        }
        //Redireccionar a la vista que permite resetear la contraseña
        req.logger.info(data);
        return res.redirect('/api/views/resetPasswordDos');
    } catch (error) {
      req.logger.error(error);
      return res.status(500).json({ status: 'error', error: 'Error interno del servidor' });
    }
  
  });

router.get("/premium/:uid", async (req, res) => {
    try {
        //Actualizamos usuario
        const uid  = req.params.uid;
        const user = await usersService.getUserByID(uid);
        if (!user){
            const error = new Error(`Error!: El usuario no existe.`);
            error.code = 14001; // Asignar un código al error
            throw error;
        }
        // Verifica si el usuario tiene cargados los documentos requeridos
        const requiredDocumentsCount = 3;
        let documents = user.documents || [];
        documents = documents.flat(); // Aplana el array de arrays
        const documentsInUploadsDocuments = documents.filter(doc => doc.reference && doc.reference.includes('uploads\\documents'));
        if (documentsInUploadsDocuments.length < requiredDocumentsCount) {
            req.logger.error('Error: El usuario no ha cargado todos los documentos requeridos para ser usuario premium.');
            return res.status(400).json({ status: 'error',  message: 'El usuario no ha cargado todos los documentos requeridos para ser usuario premium.' });
        }
        // Vemos cual role tiene actualmente
        let currentRoleId = user.role;
        // Se lo pasamos a premium
        // Debo verificar cómo cambiarle al usuario que venga el role a premium?
        let newRole = '';
        const rolePremium = await rolesService.getRoleByName('premium');
        const roleUser = await rolesService.getRoleByName('user');
        const rolePremiumIdToString = rolePremium._id.toString();
        const roleUserIdToString = roleUser._id.toString();
        if ((currentRoleId._id.toString()) === rolePremiumIdToString) {
            //console.log('El usuario ya tiene el role premium.');
            newRole = {"role" : roleUserIdToString};
        }
        if ((currentRoleId._id.toString()) === roleUserIdToString) {
            //console.log('El usuario ya tiene el role premium.');
            newRole = {"role" : rolePremiumIdToString};
        }
        Object.assign(user, newRole); 
        await usersService.updateUser(uid, user);
        return res.send({ status: "success", message: "El usuario ha cambiado de role."});
    } catch (error) {

        console.log(error);
        if (error.code === 14001) {
            req.logger.error('Error: El usuario no existe.');
            return res.status(400).json({ status: 'error', code: error.code, message: error.message });
        }
        req.logger.error('Otro tipo de error:', error.message);
        return res.status(500).json({ status: 'error', error: 'Error interno del servidor' });
    }
});

// Endpoint para subir documentos
router.post('/:uid/documents', async (req, res) => {
    try {
        const uid = req.params.uid;
        const type = req.query.type;
        // Utiliza el middleware de Multer para subir los documentos
        upload(type)(req, res, async (err) => {
            if (err) {
                return res.status(400).json({ error: err });
            }
            // Obtiene los archivos subidos y actualiza el usuario
            const documents = req.files.map(file => ({ name: file.originalname, reference: file.path }));
            const updatedUser = await usersService.updateUserDocuments(uid, documents);
            return res.status(200).json({ message: 'Documentos subidos con éxito', user: updatedUser });
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});


module.exports = router;