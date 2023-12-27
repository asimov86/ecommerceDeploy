const { faker } = require('@faker-js/faker')

/* const generateUsers = numUsers => {
    const users = [];
    for (let i = 0; i < numUsers; i++) {
        users.push(generateUser());
    }

    return users
};

const generateUser = () => {
    const numOfProducts = faker.number.int(10);   
    const products = [];
    for (let i = 0; i < numOfProducts; i++) {
        products.push(generateProducts());
    }

    return {
        name: faker.person.firstName(),
        lastname: faker.person.lastName(),
        email: faker.internet.email(),
        age: faker.number.int({ min: 18, max: 100 }),
        password: faker.internet.password({ length: 20 }),
        cart: faker.database.mongodbObjectId(),
        role: faker.helpers.arrayElement(['admin', 'user', 'premium']),
        picture: faker.image.avatar(),
        products,

    }
} */

const generateProducts = numProducts => {
    const products = [];
    for (let i = 0; i < numProducts; i++) {
        products.push(generateProduct());
    }

    return products
}

const generateProduct = () => {
    return {
        _id: faker.database.mongodbObjectId(),
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        category: faker.helpers.arrayElement(['Comida', 'Bebida', 'Postre']),
        price: faker.commerce.price(),
        thumbnail: faker.image.urlLoremFlickr({category: 'food'}),
        code: faker.string.uuid(),
        stock: faker.string.numeric({length: 2, exclude: ['0']}),    
    }
}

module.exports = generateProducts;