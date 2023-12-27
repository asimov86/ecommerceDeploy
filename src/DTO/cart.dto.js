class CartDto {
    constructor(CartRegister) {
        this.products = CartRegister.products;
    }
}

module.exports = CartDto;