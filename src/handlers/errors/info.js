const generateUserErrorInfo = user => {
    return `One or more properties were not incomplete or not valid.
    List of required properties:
    first_name: needs to be a string, received: ${user.first_name}
    last_name: needs to be a string, received: ${user.last_name}
    email: needs to be a string, received: ${user.email}
    password: needs to be a string, received: ${user.password}
    age: needs to be a string, received: ${user.age}
    `
}

const userExistErrorInfo = user => {
    return `The user ${user.email} you are trying to create already exists.`
}

const userLoginErrorInfo = user => {
    return `Error trying to login with userrrr ${user}`
}

module.exports = {generateUserErrorInfo, userExistErrorInfo, userLoginErrorInfo};