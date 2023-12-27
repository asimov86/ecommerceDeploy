class UserDto {
    constructor(userRegister) {
        this.name = userRegister.name;
        this.lastname = userRegister.lastname;
        this.email = userRegister.email;
        this.age = userRegister.age;
        this.password = userRegister.password;
        this.role = userRegister.role;
        this.cart = userRegister.cart;
        this.picture = userRegister.picture;
        this.confirmed = userRegister.confirmed;
    }
}

module.exports = UserDto;