class ProductDto {
    constructor(productRegister) {
        this.title = productRegister.title;
        this.description = productRegister.description;
        this.category = productRegister.lowerCategoryProduct;
        this.price = productRegister.price;
        this.thumbnail = productRegister.thumbnail;
        this.code = productRegister.code;
        this.stock = productRegister.stock;
    }
}

module.exports = ProductDto;