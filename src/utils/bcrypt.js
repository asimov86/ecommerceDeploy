const bcrypt = require('bcrypt')

const getHashedPassword = password => {
  const salt = bcrypt.genSaltSync(10)
  return bcrypt.hashSync(password, salt)
}

const comparePassword = (password, passwordHashed) => {
  return bcrypt.compareSync(password, passwordHashed)
}

const isValidPassword = async(user, password) =>bcrypt.compareSync(password, user.password);

module.exports = {
  getHashedPassword,
  comparePassword,
  isValidPassword
}