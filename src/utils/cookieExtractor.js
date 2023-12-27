const cookieExtractor = req => {
    let token = null
    if (req && req.cookies) {
      token = req.cookies['authCookie']
    }
    return token
  }
  
  module.exports = cookieExtractor