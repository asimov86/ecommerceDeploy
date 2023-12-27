class CustomErrors {
    static createError({name='Error', cause, message, code = 1, statusCode = 400}){
        const error = new Error(message);
        error.name = name;
        error.cause = cause;
        error.code = code;
        error.statusCode;
        throw error; //levanta la excepción
    }
}

module.exports = CustomErrors;