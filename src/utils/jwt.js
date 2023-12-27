const jwt = require('jsonwebtoken')
const { SECRET_KEY_JWT } = require('../public/js/config');

const secretKey = SECRET_KEY_JWT;

const generateToken = user => {
  return jwt.sign({ user }, secretKey, { expiresIn: '1h' })
}

const authToken = (req, res, next) => {
  const authHeader = req.headers.authorization
  if (!authHeader)
    return res.status(401).json({ status: 'error', error: 'Unauthorized' })
  const token = authHeader.split(' ')[1]
  jwt.verify(token, secretKey, (error, credentials) => {
    if (error){
      return res.status(403).json({ status: 'error', error: 'Forbidden' })
    }
    req.user = credentials.user
    next()
  })
}

/* const verifyJwt = (token, req, res, next) => {
  jwt.verify(token, secretKey, (error, credentials) => {
    if (error){
      return res.status(403).json({ status: 'error', error: 'Forbidden' })
    }
    const user = credentials.user
    return res.status(200).json({ status: 'user verified', user: user })
  })
}
 */

const verifyJwt = (authToken, req, res, next) => {
  //const token = req.params.token;
  return new Promise((resolve, reject) => {
    jwt.verify(authToken, secretKey, (error, credentials) => {
      if (error) {
        return res.status(403).json({ status: 'error', error: 'Forbidden' });
      }
      const user = credentials.user;
      resolve(user);
    });
  });
  
}

const getTokenData = async (token)=>{
  let data = null;
  jwt.verify(token, secretKey, (err, decoded)=>{
      if (err){
          console.log('Error al obtener data del token');
      }else{
          data = decoded;
      }
  });
  return data;
};



module.exports = {
  generateToken,
  authToken,
  verifyJwt,
  getTokenData
  
}